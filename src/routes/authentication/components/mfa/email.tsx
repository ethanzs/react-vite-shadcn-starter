import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp.tsx";
import {REGEXP_ONLY_DIGITS} from "input-otp"
import {Button} from "@/components/ui/button.tsx";
import {AuthContext} from "@/components/auth.tsx";
import React from "react";
import {useMutation, type UseMutationResult} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {routeMap} from "@/routing.tsx";
import {ArrowLeft} from "lucide-react";
import {PostMfa} from "@/lib/api.ts";
import {useEmailMfaMutation} from "@/lib/mutations.ts";

const RESEND_BUFFER: number = 1000 * 60;

export function Email() {
    const authContext = React.useContext(AuthContext)
    const navigate = useNavigate()

    const [code, setCode] = React.useState<string>("")
    const [resendCountdown, setResendCountdown] = React.useState<number>(RESEND_BUFFER)

    const {option} = useParams()

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (resendCountdown > 0) {
                setResendCountdown((val) => val - 1000)
            }
        }, 1000)

        return () => {
            clearTimeout(timer)
        }
    })

    // Fallback in case one is null
    if (!option) navigate(routeMap.account.mfa.path)

    const loginMfa: UseMutationResult<any, Error, string, unknown> = useMutation({
        mutationKey: ["loginMfa"],
        mutationFn: async (code: string) => {
            if (!option) throw new Error()

            const response = await PostMfa(option, {
                code: code,
            })

            if (!response.ok) throw new Error("Invalid code.")

            return await response.text()
        },
        onSuccess: () => {
            if (authContext.setAuthenticated) {
                authContext.setAuthenticated(null)
                navigate(routeMap.groups.path)
            }
        },
    })

    // Email mutation
    const emailMutation = useEmailMfaMutation(option as string)

    async function handleSubmit() {
        loginMfa.mutate(code)
    }

    async function handleResendSubmit() {
        setResendCountdown(RESEND_BUFFER)
    }

    return (
        <div className={"relative flex size-full items-center justify-center"}>
            <div className={"flex flex-col gap-3 rounded border border-muted bg-muted/10 p-8"}>
                <Button onClick={() => navigate(routeMap.account.mfa.path)}
                        variant={"outline"}
                        className={`absolute left-8 top-8`}><ArrowLeft/> Back</Button>
                <h1 className={"text-center text-2xl font-bold"}>Enter One Time Password (OTP)</h1>
                <p className={"text-center text-muted-foreground"}>We sent an email with a one time
                    password.</p>
                <div
                    className={`relative flex size-full flex-col items-center justify-center gap-3 p-3`}>
                    <InputOTP
                        pattern={REGEXP_ONLY_DIGITS}
                        maxLength={6}
                        onChange={(newValue: string) => setCode(newValue)}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} className={loginMfa.isError ? "border-destructive" : ""}/>
                            <InputOTPSlot index={1} className={loginMfa.isError ? "border-destructive" : ""}/>
                            <InputOTPSlot index={2} className={loginMfa.isError ? "border-destructive" : ""}/>
                        </InputOTPGroup>
                        <InputOTPSeparator/>
                        <InputOTPGroup>
                            <InputOTPSlot index={3} className={loginMfa.isError ? "border-destructive" : ""}/>
                            <InputOTPSlot index={4} className={loginMfa.isError ? "border-destructive" : ""}/>
                            <InputOTPSlot index={5} className={loginMfa.isError ? "border-destructive" : ""}/>
                        </InputOTPGroup>
                    </InputOTP>
                    {loginMfa.error &&
                        <p className={"text-center text-xs text-red-500 drop-shadow-lg"}>{loginMfa.error.message}</p>}
                </div>
                <div className={"flex flex-col items-center justify-center gap-3"}>
                    <Button
                        onClick={() => handleSubmit()}
                        disabled={code.length !== 6 || loginMfa.isPending}>
                        Log In
                    </Button>
                    <Button variant={"link"} className={"text-muted-foreground"}
                            onClick={handleResendSubmit}
                            disabled={emailMutation.isPending || resendCountdown > 0}>{resendCountdown > 0 && "(" + (resendCountdown / 1000) + ")"} Resend
                        Email</Button>
                </div>
            </div>
        </div>
    )
}