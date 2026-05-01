import {Navigate, useNavigate, useParams} from "react-router-dom"
import React from "react";
import {Button} from "@/components/ui/button.tsx";
import {routeMap} from "@/routing.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {LoaderCircle, Mail} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import {Email} from "@/routes/authentication/components/mfa/email.tsx";
import {useEmailMfaMutation} from "@/lib/mutations.ts";
import {Totp} from "@/routes/authentication/components/mfa/totp.tsx";
import {GetLogout} from "@/lib/api.ts";
import {AuthContext} from "@/components/auth.tsx";


export default function Mfa() {
    const authContext = React.useContext(AuthContext);
    const [selectedOption, setSelectedOption] = React.useState<string>("0")

    const navigate = useNavigate()
    const {option} = useParams()

        const options = authContext.data?.mfaState?.["mfa-options"]
    const mfaType = options?.[Number(selectedOption)]?.["type"]

    // Email mutation
    const emailMutation = useEmailMfaMutation(mfaType)

    function handleSubmit() {
        // Ensure both are not null
        if (!mfaType) throw new Error()

        // Mutations
        switch (mfaType) {
            case "email":
                emailMutation.mutate()
                break;
            case "totp":
                navigate(routeMap.account.mfa.path + "/" + mfaType)
                break;
        }
    }

    /**
     * Handles the logout functionality for a user session.
     *
     * This method performs necessary operations to log a user out, such as clearing session data,
     * invalidating authentication tokens, and redirecting the user if required.
     *
     * @return {void} No return value.
     */
    async function handleLogout(): Promise<void> {
        await GetLogout();
        if (authContext.setAuthenticated) {
            authContext.setAuthenticated(null);
        }
        navigate("/")
    }

    if (authContext.data?.mfaState && authContext.data?.mfaState["mfa-verified"]) {
        return <Navigate to={routeMap.account.login.path}/>
    } else {
        if (option) {
            // ------------------------------------
            //             MAIN ENTRY
            //            Forms of MFA
            // ------------------------------------
            switch (option) {
                case "email":
                    return <Email/>
                case "totp":
                    return <Totp/>
            }

        } else {
            return <div className={"relative flex size-full items-center justify-center"}>
                <div className="mx-auto flex w-full flex-col justify-center space-y-3 sm:w-[350px]">

                    <Button className={`absolute left-8 top-8`} variant={"outline"}
                            onClick={handleLogout}>Back</Button>
                    <h1 className={"text-2xl"}>Multi Factor Authentication</h1>

                    {
                        options
                            ? <div className={"flex flex-col gap-3"}>
                                <RadioGroup className="gap-2" defaultValue={selectedOption}
                                            onValueChange={(value) => {
                                                setSelectedOption(value)
                                            }}>
                                    {
                                        options.map((v, id) => <div
                                            key={id}
                                            className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-xs shadow-black/5 has-data-[state=checked]:border-ring">
                                            <RadioGroupItem
                                                value={id.toString()}
                                                id={id.toString()}
                                                aria-describedby={`${id}-description`}
                                                className="order-1 after:absolute after:inset-0"
                                            />
                                            <div className="flex grow items-center gap-3">
                                                <div className={"rounded-full bg-primary/25 p-2 text-primary"}>
                                                    <Mail className={"size-6"}/>
                                                </div>
                                                <div className="grid grow gap-2">
                                                    <Label htmlFor={`${id}`}>
                                                        {v["display-name"]}{" "}
                                                    </Label>
                                                    <p id={`${id}-description`} className="text-xs text-muted-foreground">
                                                        An email with a six-digit code will be sent to your email address.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>)
                                    }
                                </RadioGroup>
                                <Button variant={"outline"} onClick={handleSubmit} disabled={emailMutation.isPending}>
                                    {emailMutation.isPending && <LoaderCircle className={"animate-spin"}/>}
                                    Next
                                </Button>
                            </div>
                            : <div className="flex flex-col space-y-3">
                                <Skeleton className="h-[125px] w-full rounded-lg"/>
                            </div>
                    }


                </div>
            </div>
        }
    }
}
