import * as React from "react"

import {cn, sleep} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {LoaderCircle as Loader} from "lucide-react";
import {FaGithub as Github, FaGitlab as Gitlab} from "react-icons/fa";
import {PostLogin, ResponseMessages} from "@/lib/api";
import {Link, useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import {routeMap} from "@/routing.tsx";
import {AuthContext} from "@/components/auth.tsx";

// const BACKOFF_LOGIC: boolean = false;
const LOGIN_BUFFER: number = 200;

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function UserAuthForm({className, ...props}: UserAuthFormProps) {
    const authContext = React.useContext(AuthContext)
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = React.useState<boolean>(false)

    const login = useMutation({
        mutationKey: ["login"],
        mutationFn: async (data: any) => {
            const response = await PostLogin(data["email"], data["password"])

            if (!response.ok) throw new Error(ResponseMessages.Login[response.status.toString()] ?? "There was an unexpected error.")

            if (response.status === 200) {
                // Good to go. No MFA
                return await response.text()
            } else {
                return await response.json()
            }
        },
        retry: false,
        onSuccess: (data) => {
            // No MFA
            if (typeof data === "string") {
                if (authContext.setAuthenticated) {
                    authContext.setAuthenticated(null)
                    navigate(routeMap.groups.path)
                }
            } else { // MFA
                if (authContext.setAuthenticated) {
                    authContext.setAuthenticated(null)
                    navigate([routeMap.account.mfa.path, data["type"]].join("/"))
                }
            }
        },
        onError: (error) => setError("_error", {message: error.message}),
    })

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
    } = useForm({
        mode: "onBlur",
        criteriaMode: "all"
    });

    const isLoading = isSubmitting || login.isPending

    async function onSubmit(data: any) {
        await sleep(LOGIN_BUFFER); // Floor for any login attempts (including showing password)

        if (!showPassword) {
            if (!data.email) return "Please enter your email address."

            setShowPassword(true)
        } else {
            login.mutate(data);
        }
        return null;
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <Label className={showPassword ? "" : "sr-only"} htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            className={errors.email ? "border-red-500 drop-shadow-md" : ""}
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            {...register('email', {
                                required: "Email is required.",
                                maxLength: {
                                    value: 254,
                                    message: "Max length is 254."
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: 'Invalid email format'
                                }
                            })}
                        />
                        <span className={"text-xs text-red-500"}>
                            <ErrorMessage errors={errors} name="email"/>
                        </span>
                        <div/>
                        {
                            showPassword
                                ? <>
                                    <Label htmlFor="password">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        placeholder="Your top secret password"
                                        className={errors.password ? "border-red-500 drop-shadow-md" : ""}
                                        type="password"
                                        autoCapitalize="none"
                                        autoComplete="password"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        {...register('password', {
                                            required: "This is required.",
                                        })}
                                    />
                                    <Link to={"/forgot-password"}
                                          className={"text-right text-xs text-neutral-400 hover:underline"}>Forgot
                                        your
                                        password?</Link>
                                    <div/>
                                </>
                                : null
                        }
                    </div>
                    <Button disabled={isLoading} type={"submit"}>
                        {isLoading && (
                            <Loader className="animate-spin"/>
                        )}
                        {isLoading ? "" : "Sign In"}
                    </Button>
                    {errors._error &&
                        <p className={"text-xs text-red-500 drop-shadow-md"}>{String(errors._error.message)}</p>}
                    <p className={"flex flex-row items-center justify-center gap-1 text-center text-sm text-muted-foreground"}>Don't
                        have an
                        account?
                        {} <Link to={"/account/signup"}
                                 className={"flex flex-row items-center gap-0.5 underline hover:text-primary"}>Sign
                            up </Link>
                    </p>

                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"/>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
            </div>
            <div className={"flex flex-col gap-y-3"}>
                <Button variant="outline" type="button" disabled={isLoading}>
                    <div className={"flex h-full w-18 flex-row items-center justify-between"}>
                        <Gitlab className="mr-2 size-4"/>{" "}
                        GitLab
                    </div>
                </Button>
                <Button variant="outline" type="button" disabled={isLoading}>
                    <div className={"flex h-full w-18 flex-row items-center justify-between"}>
                        <Github className="mr-2 size-4"/>{" "}
                        GitHub
                    </div>
                </Button>
            </div>
        </div>
    )
}
