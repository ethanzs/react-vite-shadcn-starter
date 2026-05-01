import * as React from "react"
import {useForm} from 'react-hook-form';
import {ErrorMessage} from "@hookform/error-message"

import {cn, sleep} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {EyeIcon, EyeOffIcon, LoaderCircle as Loader, Sparkle} from "lucide-react";
import {useNavigate} from "react-router-dom";
// import {PhoneInput} from "@/components/ui/phone-input.tsx";
import {PostLogin, PostRegister, PostRegisterBody, ResponseMessages} from "@/lib/api.ts";
import {routeMap} from "@/routing.tsx";
import {useMutation} from "@tanstack/react-query";
import {AuthContext} from "@/components/auth.tsx";

const REGISTER_BUFFER: number = 200;

type SignupFormProps = React.HTMLAttributes<HTMLDivElement>

export function SignupForm({className, ...props}: SignupFormProps) {
    const authContext = React.useContext(AuthContext)

    const [showPassword, setShowPassword] = React.useState<boolean>(false)

    const navigate = useNavigate();

    const registerMutation = useMutation({
        mutationKey: ["register"],
        mutationFn: async (data: PostRegisterBody) => {
            const response = await PostRegister(data)

            if (!response.ok) throw new Error("There was an unexpected error.")

            return await response.json()
        },
        retry: false,
        onSuccess: () => loginMutation.mutate({email: emailValue, password: passwordValue}),
        onError: (error) => setError("_error", {message: error.message}),
    })

    const loginMutation = useMutation({
        mutationKey: ["login"],
        mutationFn: async (data: any) => {
            const response = await PostLogin(data["email"], data["password"])

            if (!response.ok) throw new Error(ResponseMessages.Login[response.status.toString()] ?? "There was an unexpected error.")

            return await response.json()
        },
        retry: false,
        onSuccess: () => {
            if (authContext.setAuthenticated) {
                authContext.setAuthenticated(null)
            }
            navigate(routeMap.account.mfa.path)
        },
        onError: () => navigate(routeMap.account.login.path),
    })

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: {errors, isValid, isSubmitting},
    } = useForm({
        mode: "all",
        criteriaMode: "all"
    });
    const emailValue = watch('email');
    const passwordValue = watch('password');

    const onSubmit = async (data: any) => {
        await sleep(REGISTER_BUFFER); // Floor

        // Format number
        const e164: string = "(888) 888-8888".replace(
            /^\((\d{3})\)\s?(\d{3})-(\d{4})$/,
            "+1$1$2$3"
        );

        const body: PostRegisterBody = {
            "first-name": data.firstName,
            "last-name": data.lastName,
            email: data.email,
            password: data.password,
            phone: e164,
            consent: true,
            type: "password"
        }

        // Register
        registerMutation.mutate(body);
    };

    const isLoading = isSubmitting || registerMutation.isPending || loginMutation.isPending

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="grid gap-4">

                    {/* Name */}
                    <div className={"flex flex-row gap-2 "}>
                        {/* First Name */}
                        <div className="grid flex-1 gap-2 self-start">
                            <Label htmlFor="firstName" className={"flex flex-row items-center gap-1"}>
                                First Name <Sparkle className={"size-2 text-primary"}/>
                            </Label>
                            <Input
                                id="firstName"
                                className={errors.firstName ? "border-red-500 drop-shadow-md" : ""}
                                placeholder="John"
                                autoCapitalize="none"
                                autoCorrect="off"
                                disabled={isLoading}
                                {...register('firstName', {
                                    required: "This is required.",
                                    maxLength: {
                                        value: 20,
                                        message: "Max length is 20."
                                    }
                                })}
                            />
                            <span className={"text-xs text-red-500"}>
                                <ErrorMessage errors={errors} name="firstName"/>
                            </span>
                        </div>

                        {/* Last Name */}
                        <div className="grid flex-1 gap-2  self-start">
                            <Label htmlFor="lastName" className={"flex flex-row items-center gap-1"}>
                                Last Name <Sparkle className={"size-2 text-primary"}/>
                            </Label>
                            <Input
                                id="lastName"
                                className={errors.lastName ? "border-red-500 drop-shadow-md" : ""}
                                placeholder="Smith"
                                autoCapitalize="none"
                                autoCorrect="off"
                                disabled={isLoading}
                                {...register('lastName', {
                                    required: "This is required.",
                                    maxLength: {
                                        value: 20,
                                        message: "Max length is 20."
                                    }
                                })}
                            />
                            <span className={"text-xs text-red-500"}>
                                <ErrorMessage errors={errors} name="lastName"/>
                            </span>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className={"flex flex-row items-center gap-1"}>
                            Email <Sparkle className={"size-2 text-primary"}/>
                        </Label>
                        <Input
                            id="email"
                            className={errors.email ? "border-red-500 drop-shadow-md" : ""}
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={isLoading}
                            {...register('email', {
                                    required: "This is required.",
                                    maxLength: {
                                        value: 254,
                                        message: "Max length is 20."
                                    },
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Invalid email format'
                                    }
                                }
                            )}
                        />
                        <span className={"text-xs text-red-500"}>
                            <ErrorMessage errors={errors} name="email"/>
                        </span>
                    </div>

                    {/* Phone */}
                    {/*<div className="grid gap-2">*/}
                    {/*    <Label htmlFor="phone" className={"flex flex-row items-center gap-1"}>*/}
                    {/*        Phone Number <Sparkle className={"h-2 w-2 text-primary"}/>*/}
                    {/*    </Label>*/}
                    {/*    <PhoneInput*/}
                    {/*        id="phone"*/}
                    {/*        className={errors.phone ? "border border-red-500" : ""}*/}
                    {/*        placeholder="(123) 456-7890"*/}
                    {/*        type="phone"*/}
                    {/*        autoCapitalize="none"*/}
                    {/*        autoCorrect="off"*/}
                    {/*        disabled={isLoading}*/}
                    {/*        defaultCountry={"US"}*/}
                    {/*        // countries={["US", "CA", ]}*/}
                    {/*        {...register('phone', {*/}
                    {/*            required: 'This is required',*/}
                    {/*            pattern: {*/}
                    {/*                // Example: US-based 10-digit phone number without special characters*/}
                    {/*                value: /^\(\d{3}\)\s\d{3}-\d{4}$/,*/}
                    {/*                message: 'Enter a valid 10-digit phone number'*/}
                    {/*            }*/}
                    {/*        })}*/}
                    {/*    />*/}
                    {/*    <span className={"text-xs text-red-500"}>*/}
                    {/*        <ErrorMessage errors={errors} name="phone"/>*/}
                    {/*    </span>*/}
                    {/*</div>*/}

                    {/*DOB - Not using atm*/}
                    {/*<div className="grid gap-2">*/}
                    {/*    <Label htmlFor="dob">*/}
                    {/*        Date of Birth*/}
                    {/*    </Label>*/}
                    {/*    <Popover>*/}
                    {/*        <PopoverTrigger asChild>*/}
                    {/*            <Button*/}
                    {/*                variant={"outline"}*/}
                    {/*                className={cn(*/}
                    {/*                    "justify-start text-left font-normal",*/}
                    {/*                    !date && "text-muted-foreground"*/}
                    {/*                )}*/}
                    {/*            >*/}
                    {/*                <CalendarIcon/>*/}
                    {/*                {date ? format(date, "PPP") : <span>Pick a date</span>}*/}
                    {/*            </Button>*/}
                    {/*        </PopoverTrigger>*/}
                    {/*        <PopoverContent className="w-auto p-0">*/}
                    {/*            <Calendar*/}
                    {/*                mode="single"*/}
                    {/*                captionLayout="dropdown"*/}
                    {/*                selected={date}*/}
                    {/*                onSelect={setDate}*/}
                    {/*                fromYear={1900}*/}
                    {/*                toYear={new Date().getFullYear()}*/}
                    {/*            />*/}
                    {/*        </PopoverContent>*/}
                    {/*    </Popover>*/}
                    {/*</div>*/}

                    {/* Password */}
                    <div className="relative grid gap-2">
                        <Label htmlFor="password" className={"flex flex-row items-center gap-1"}>
                            Password <Sparkle className={"size-2 text-primary"}/>
                        </Label>
                        <div className={"relative"}>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                aria-autocomplete={"none"}
                                autoCorrect="off"
                                disabled={isLoading}
                                placeholder="Enter your password"
                                className={errors.password ? "border-red-500 drop-shadow-md" : ""}
                                {...register('password', {
                                    required: 'Password is required',
                                    pattern: {
                                        // Explanation:
                                        // 1) (?=.*[!@#$%^&*]) => at least one special character from the given set
                                        // 2) (?=.*[A-Z])     => at least one uppercase letter
                                        // 3) (?=.*[a-z])     => at least one lowercase letter
                                        // 4) .{12,}          => at least 8 characters in total length
                                        value: /^(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z]).{8,}$/,
                                        message:
                                            'Password must be at least 8 characters long and include at least one uppercase, one lowercase, and one special character',
                                    },
                                })} // 7Q}h9jSCAt;3&m}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1 size-7"
                                aria-autocomplete={"none"}
                                autoCorrect="off"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {
                                    showPassword
                                        ? <EyeIcon className="size-4"/>
                                        : <EyeOffIcon className="size-4"/>
                                }
                                <span className="sr-only">Toggle password visibility</span>
                            </Button>
                        </div>
                        <span className={"text-xs text-red-500"}>
                            <ErrorMessage errors={errors} name="password"/>
                        </span>
                    </div>

                    {/* Password Again */}
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword" className={"flex flex-row items-center gap-1"}>
                            Confirm Password <Sparkle className={"size-2 text-primary"}/>
                        </Label>
                        <div className={"relative"}>
                            <Input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                aria-autocomplete={"none"}
                                autoCorrect="off"
                                disabled={isLoading}
                                className={errors.confirmPassword ? "border-red-500 drop-shadow-md" : ""}
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (value) => value === passwordValue || 'Passwords do not match'
                                })}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1 size-7"
                                aria-autocomplete={"none"}
                                autoCorrect="off"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {
                                    showPassword
                                        ? <EyeIcon className="size-4"/>
                                        : <EyeOffIcon className="size-4"/>
                                }
                                <span className="sr-only">Toggle password visibility</span>
                            </Button>
                        </div>
                        <span className={"text-xs text-red-500"}>
                            <ErrorMessage errors={errors} name="confirmPassword"/>
                        </span>
                    </div>

                    {/* Submit */}
                    <Button disabled={!isValid} type={"submit"}>
                        {isLoading && (
                            <Loader className="animate-spin"/>
                        )}
                        {isLoading ? "" : "Sign Up"}
                    </Button>

                    {/* Form level error */}
                    {errors._error &&
                        <p className={"text-xs text-red-500 drop-shadow-md"}>{String(errors._error.message)}</p>}
                </div>
            </form>
        </div>
    )
}
