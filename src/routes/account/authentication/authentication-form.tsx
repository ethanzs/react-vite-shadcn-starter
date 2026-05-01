import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator.tsx";
import {RiGithubFill, RiGoogleFill} from "react-icons/ri";
import {RiGitlabFill} from "@remixicon/react";
import {Badge} from "@/components/ui/badge.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {EllipsisVertical, KeyRound, Mail, MessageSquareLock, Smartphone, TriangleAlert} from "lucide-react";
import {Banner} from "@/components/ui/banner.tsx";
import React from "react";
import AddAuthenticator from "@/components/blocks/add-authenticator.tsx";
import {useQueryClient} from "@tanstack/react-query";
import {useAuthData} from "@/hooks/useAuthData.ts";
import ChangePassword from "@/components/blocks/change-password.tsx";

export function AuthenticationForm() {
    const [showAddAuthenticator, setShowAddAuthenticator] = React.useState<boolean>(false)
    const [showChangePassword, setShowChangePassword] = React.useState<boolean>(false)

    // Get QueryClient from the context
    const queryClient = useQueryClient()
    queryClient.invalidateQueries({queryKey: ['mfaState']})

    const {authData} = useAuthData()

    const hasTotp: boolean = (authData?.mfaState?.["mfa-options"]?.filter((item) => item.type === "totp") || []).length > 0
    const hasSecurityKeys: boolean = (authData?.mfaState?.["mfa-options"]?.filter((item) => item.type === "security-key") || []).length > 0
    const hasEmail: boolean = (authData?.mfaState?.["mfa-options"]?.filter((item) => item.type === "email") || []).length > 0
    const hasSms: boolean = (authData?.mfaState?.["mfa-options"]?.filter((item) => item.type === "sms") || []).length > 0

    const hasAnyMfa: boolean = hasTotp || hasSecurityKeys || hasEmail || hasSms

    return (
        <div>
            {/* Change Password */}
            <div className={"flex flex-col gap-4"}>
                <div className={"flex flex-col gap-0.5"}>
                    <div className={"flex flex-row items-center justify-between"}>
                        <h1 className={"text-2xl font-semibold"}>Password</h1>
                        <Button size={"sm"} variant={"secondary"}
                                onClick={() => setShowChangePassword(() => !showChangePassword)}>{showChangePassword ? "Cancel" : "Change"}</Button>
                    </div>
                    <Separator className={"my-3"}/>
                    <p className={"text-sm text-muted-foreground"}>Strengthen your account by ensuring your password is
                        strong.</p>
                    {
                        showChangePassword
                            ? <>
                                <Separator className={"my-2 bg-transparent"}/>
                                <div className={"max-w-lg"}>
                                    <ChangePassword/>
                                </div>
                            </>
                            : null
                    }
                </div>
            </div>

            <Separator className={"my-8 bg-transparent"}/>

            {/* Two-Factor Authentication */}
            <div className={"flex flex-col gap-4"}>
                <div className={"flex flex-col gap-0.5"}>
                    <div className={"flex flex-row items-center justify-between"}>
                        <h1 className={"text-2xl font-semibold"}>Two-Factor Authentication</h1>
                        {
                            hasAnyMfa && <Badge variant="outline"
                                                className="w-auto gap-1.5 border-green-500/50 py-1 text-green-500 ">
                                Enabled
                            </Badge>
                        }

                    </div>
                    <Separator className={"my-3"}/>
                    <p className={"text-sm text-muted-foreground"}>Increase your account's security by configuring
                        two-factor
                        authentication (2FA).</p>
                </div>

                <div className={"flex flex-col rounded border border-secondary"}>
                    {/* Title */}
                    <div className={"bg-muted/50 p-4"}>
                        <h1 className={"text-sm font-bold"}>Two-factor Methods</h1>
                    </div>

                    <Separator/>

                    {
                        !hasTotp && <Banner variant={"warning"} dismissible icon={<TriangleAlert/>}
                                            description={" Please configure another 2FA method to reduce your risk of permanent account lockout. If you use SMS for 2FA, we strongly recommend against SMS as it is prone to fraud and delivery may be unreliable depending on your region. "}/>
                    }

                    {/* Authenticator App */}
                    <div className={"flex flex-row items-center justify-between p-4"}>
                        <div className={"flex flex-row gap-2"}>
                            <Smartphone/>
                            <div className={"flex flex-col gap-1"}>
                                <div className={"flex flex-row items-center gap-2"}>
                                    <h1 className={"text-sm font-bold"}>Authenticator App</h1>

                                    {
                                        hasTotp && <Badge variant="outline" className="w-auto gap-1.5 ">
                                                    <span className="size-1.5 rounded-full bg-green-500"
                                                          aria-hidden="true"></span>
                                            Configured
                                        </Badge>

                                    }
                                </div>
                                <p className={"text-xs text-muted-foreground"}>Use an authentication app or browser
                                    extension to get
                                    two-factor authentication codes
                                    when prompted.</p>

                                {
                                    showAddAuthenticator
                                        ? <>
                                            <Separator className={"my-2 bg-transparent"}/>

                                            <AddAuthenticator onCancel={() => setShowAddAuthenticator(false)}/>
                                        </>
                                        : null
                                }
                            </div>
                        </div>
                        {
                            !showAddAuthenticator && !hasTotp
                                ? <Button variant={"outline"} size={"sm"}
                                          onClick={() => setShowAddAuthenticator(true)}>Add</Button>
                                : <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button variant={"ghost"} size={"icon"}><EllipsisVertical/></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem className={"text-destructive"}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                        }
                    </div>

                    <Separator/>

                    {/* Email */}
                    <div className={"flex flex-row items-center justify-between p-4"}>
                        <div className={"flex flex-row gap-2"}>
                            <Mail/>
                            <div className={"flex flex-col gap-1"}>
                                <div className={"flex flex-row items-center gap-2"}>
                                    <h1 className={"text-sm font-bold"}>Email</h1>

                                    {
                                        hasEmail && <Badge variant="outline" className="w-auto gap-1.5 ">
                                            <span className="size-1.5 rounded-full bg-green-500" aria-hidden="true"></span>
                                            Configured
                                        </Badge>
                                    }

                                </div>
                                <p className={"text-xs text-muted-foreground"}>You will receive one-time codes at your
                                    primary email.</p>
                            </div>
                        </div>

                        {
                            !hasEmail
                                ? <Button variant={"outline"} size={"sm"}>Add</Button>
                                : <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button variant={"ghost"} size={"icon"}><EllipsisVertical/></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem className={"text-destructive"}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                        }

                    </div>

                    <Separator/>

                    {/* SMS/Text Message */}
                    <div className={"flex flex-row items-center justify-between p-4"}>
                        <div className={"flex flex-row gap-2"}>
                            <MessageSquareLock/>
                            <div className={"flex flex-col gap-1"}>
                                <div className={"flex flex-row items-center gap-2"}>
                                    <h1 className={"text-sm font-bold"}>SMS/Text Message</h1>

                                    {
                                        hasSms && <Badge variant="outline" className="w-auto gap-1.5 ">
                                            <span className="size-1.5 rounded-full bg-green-500" aria-hidden="true"></span>
                                            Configured
                                        </Badge>
                                    }

                                </div>
                                <p className={"text-xs text-muted-foreground"}>You will receive one-time codes at this
                                    phone number: +1 XXXXXX4177</p>
                            </div>
                        </div>

                        {
                            !hasSms
                                ? <Button variant={"outline"} size={"sm"}>Add</Button>
                                : <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button variant={"ghost"} size={"icon"}><EllipsisVertical/></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem className={"text-destructive"}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                        }

                    </div>

                    <Separator/>

                    {/* Security Keys */}
                    <div className={"flex flex-row items-center justify-between p-4"}>
                        <div className={"flex flex-row gap-2"}>
                            <KeyRound/>
                            <div className={"flex flex-col gap-1"}>
                                <div className={"flex flex-row items-center gap-2"}>
                                    <h1 className={"text-sm font-bold"}>Security Keys</h1>

                                    {
                                        hasSecurityKeys && <Badge variant="outline" className="w-auto gap-1.5 ">
                                            <span className="size-1.5 rounded-full bg-green-500" aria-hidden="true"></span>
                                            Configured
                                        </Badge>
                                    }

                                </div>
                                <p className={"text-xs text-muted-foreground"}>Security keys are webauthn credentials
                                    that can only be used as a second factor of authentication.</p>
                            </div>
                        </div>

                        {
                            !hasSecurityKeys
                                ? <Button variant={"outline"} size={"sm"}>Add</Button>
                                : <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button variant={"ghost"} size={"icon"}><EllipsisVertical/></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem className={"text-destructive"}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                        }


                    </div>

                    <Separator/>

                    {/* Title */}
                    <div className={"bg-muted/50 p-4"}>
                        <h1 className={"text-sm font-bold"}>Recovery Options</h1>
                    </div>

                    <Separator/>

                    {/* Security Keys */}
                    <div className={"flex flex-row items-center justify-between p-4"}>
                        <div className={"flex flex-row gap-2"}>
                            <KeyRound/>
                            <div className={"flex flex-col gap-1"}>
                                <div className={"flex flex-row items-center gap-2"}>
                                    <h1 className={"text-sm font-bold"}>Recovery Codes</h1>
                                    <Badge variant="outline" className="w-auto gap-1.5 ">
                                        <span className="size-1.5 rounded-full bg-green-500" aria-hidden="true"></span>
                                        Viewed
                                    </Badge>
                                </div>
                                <p className={"text-xs text-muted-foreground"}>Use an authentication app or browser
                                    extension to get
                                    two-factor authentication codes
                                    when prompted.</p>
                            </div>
                        </div>
                        <Button variant={"outline"} size={"sm"}>View</Button>
                    </div>
                </div>
            </div>

            <Separator className={"my-8 bg-transparent"}/>

            {/* Service Sign-In */}
            <div className={"flex flex-col gap-4"}>
                <div className={"flex flex-col gap-0.5"}>
                    <h1 className={"text-2xl font-semibold"}>Service Sign-In</h1>
                    <Separator className={"my-3"}/>
                    <p className={"text-sm text-muted-foreground"}>Connect or disconnect a service for sign-in. </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button className={"w-auto px-6"} variant="secondary" aria-label="Login with Google"
                            size="icon">
                        <RiGoogleFill className="" size={16} aria-hidden="true"/>
                        Disconnect Google
                    </Button>
                    <Button className={"w-auto px-6"} variant="secondary" aria-label="Login with X" size="icon">
                        <RiGitlabFill className="" size={16} aria-hidden="true"/>
                        Disconnect GitLab
                    </Button>
                    <Button className={"w-auto px-6"} variant="outline" aria-label="Login with GitHub" size="icon">
                        <RiGithubFill className="" size={16} aria-hidden="true"/>
                        Connect GitHub
                    </Button>
                </div>
            </div>
        </div>
    )
}
