import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator.tsx";
import React from "react";
import {useAuthData} from "@/hooks/useAuthData.ts";
import {Input} from "@/components/ui/input.tsx";
import {EllipsisVertical, TriangleAlert} from "lucide-react";
import {Link} from "react-router-dom";
import {Badge} from "@/components/ui/badge.tsx";
import {Label} from "@/components/ui/label.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Banner} from "@/components/ui/banner.tsx";
import {useAddVerificationBackupEmailMutation, useDeleteBackupEmailMutation,} from "@/lib/mutations.ts";
import {useGetBackupEmailsQuery} from "@/lib/queries.ts";
import {fixtureGroupsOwned, isSimulatedAuth} from "@/lib/fixtures.ts";

export function AccountForm() {
    const groupsOwned: string[] = isSimulatedAuth() ? fixtureGroupsOwned : [];
    const {authData} = useAuthData()

    // TODO: Use form validation instead
    const [newEmail, setNewEmail] = React.useState<string>("")

    // Mutations and queries
    const getEmailsQuery = useGetBackupEmailsQuery()
    const addBackupEmailMutation = useAddVerificationBackupEmailMutation()
    const deleteBackupEmailMutation = useDeleteBackupEmailMutation()

    const primaryEmail = authData.me?.email

    const backupEmailsVerified = getEmailsQuery.data && (getEmailsQuery.data.filter((email) => email["backup-email-verified"]))
    const hasBackupEmail = backupEmailsVerified && backupEmailsVerified.length > 0

    function handleAddBackupEmail(email: string) {
        addBackupEmailMutation.mutate(email)
    }

    function handleDeleteBackupEmail(email: string) {
        deleteBackupEmailMutation.mutate(email)
    }

    return (
        <div>
            {/* Change Email */}
            <div className={"flex flex-col gap-4"}>
                <div className={"flex flex-col gap-4"}>
                    <div>
                        <div className={"flex flex-row items-center justify-between"}>
                            <h1 className={"text-2xl font-semibold"}>Emails</h1>
                        </div>
                        <Separator className={"my-3"}/>
                        <p className={"text-sm text-muted-foreground"}>Manage the email(s) associated with your account.</p>
                    </div>

                    {getEmailsQuery.data
                        ? !hasBackupEmail
                            ? <Banner icon={<TriangleAlert/>} variant={"warning"}
                                      description={"You have a single verified email associated with your account. Add an additional verified backup email address in case you lose access to your primary email."}/>
                            : null
                        : null
                    }

                    {/* Emails */}
                    <div className={"flex flex-col rounded border border-border"}>

                        {/*Primary email*/}
                        <div className={"flex flex-row items-start justify-between"}>
                            <div
                                className={"flex w-full flex-col gap-1 p-4"}>
                                <div className={"flex flex-row items-center gap-2"}>
                                    <h1 className={"font-medium"}>{primaryEmail}</h1>
                                    <Badge variant="outline"
                                           className="w-auto gap-1.5 border-green-500/50 text-green-500">
                                        Primary
                                    </Badge>
                                </div>
                                <p className={"text-xs text-muted-foreground"}>This email will be used for
                                    account-related
                                    notifications, 2FA, and can also be used for password
                                    resets.</p>
                                <ul className={"list-disc pl-4 pt-2 text-sm text-muted-foreground"}>
                                    <li>
                                        You log in with this email
                                        <ul className={"list-inside text-xs text-muted-foreground"}>
                                            <li>This email address is used on the login page for authentication.
                                            </li>
                                        </ul>
                                    </li>
                                    <Separator className={"my-1 bg-transparent"}/>
                                    <li>
                                        Receives notifications
                                        <ul className={"list-inside text-xs text-muted-foreground"}>
                                            <li>This email address is used for notifications, e.g.,
                                                login from a new location, new features, etc.
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            <div className={"p-4"}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button variant={"ghost"} size={"icon"}><EllipsisVertical/></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem disabled>Set as primary</DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem className={"text-destructive"}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {
                            getEmailsQuery.data && getEmailsQuery.data.map((email) => {
                                return <>
                                    <Separator/>

                                    {/*Secondary email*/}
                                    <div className={"flex flex-row items-start justify-between"}>
                                        <div
                                            className={"flex w-full flex-col gap-1 p-4"}>
                                            <div className={"flex flex-row items-center gap-2"}>
                                                <h1 className={"font-medium"}>{email["backup-email"]}</h1>
                                                <Badge variant="outline"
                                                       className="w-auto gap-1.5 border-neutral-400/50 text-neutral-400">
                                                    Backup
                                                </Badge>
                                            </div>
                                            <p className={"text-xs text-muted-foreground"}>Your backup GitHub email address
                                                will be
                                                used as an additional destination for security-relevant account
                                                notifications and
                                                can also be used for password resets.</p>
                                            <ul className={"list-disc pl-4 pt-2 text-sm text-muted-foreground"}>
                                                {
                                                    email["backup-email-verified"]
                                                        ? null
                                                        : <li>
                                                            <span className={"font-semibold text-orange-500"}>Unverified</span>
                                                            <ul className={"list-inside text-xs text-muted-foreground"}>
                                                                <li>This email is awaiting verification. Check your email</li>
                                                            </ul>
                                                            <Button variant={"outline"} size={"sm"}
                                                                    className={"mt-2"}>Resend
                                                                verification
                                                                email</Button>
                                                        </li>
                                                }
                                            </ul>
                                        </div>
                                        <div className={"p-4"}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <Button variant={"ghost"} size={"icon"}><EllipsisVertical/></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>Set as primary</DropdownMenuItem>
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem
                                                        className={"text-destructive"}
                                                        onClick={() => handleDeleteBackupEmail(email["backup-email"])}>Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </>
                            })
                        }
                    </div>
                </div>

                <div className={"flex max-w-sm flex-col gap-2"}>
                    <Label htmlFor={"email"}>Add Backup Email</Label>
                    <div className={"flex flex-row items-center gap-3"}>
                        <Input disabled={addBackupEmailMutation.isPending} value={newEmail}
                               onChange={(e) => setNewEmail(e.target.value)} id={"email"}
                               placeholder="Backup Email" type="email"/>
                        <div>
                            <Button disabled={addBackupEmailMutation.isPending} variant={"secondary"}
                                    onClick={() => handleAddBackupEmail(newEmail)}>Add</Button>
                        </div>
                    </div>
                    {addBackupEmailMutation.isError &&
                        <p className={"text-xs text-destructive"}>{addBackupEmailMutation.error.message}</p>}
                </div>

            </div>

            <Separator className={"my-8 bg-transparent"}/>

            {/* Delete Account */}
            <div className={"flex flex-col gap-4"}>
                <div className={"flex flex-col gap-4"}>
                    <div>
                        <div className={"flex flex-row items-center justify-between"}>
                            <h1 className={"text-2xl font-semibold"}>Delete account</h1>

                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger>
                                        <Button disabled={true} type="submit" variant="secondary" size="sm"
                                                className={"text-destructive"}>Permanently delete my account</Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>You must transfer ownership of your groups first.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                        </div>
                        <Separator className={"my-3"}/>
                        <p className={"text-sm text-muted-foreground"}>Permanently delete your account.</p>
                    </div>

                    <p className={"text-sm"}>Your account is currently an owner in these
                        groups: {groupsOwned.map((group, i) => {
                            return <>
                                <Link to={"#"} className={"font-bold"}>{group}</Link>
                                {i === groupsOwned.length - 1 ? ". " : ", "}
                            </>
                        })}

                        You must remove yourself, transfer ownership, or delete these organizations before you can
                        delete your user. </p>

                    {/*<Banner icon={<ShieldAlert/>} title={"Caution"} variant={"destructive"}*/}
                    {/*        description={"This action cannot be undone."}/>*/}
                </div>
            </div>

        </div>
    )
}
