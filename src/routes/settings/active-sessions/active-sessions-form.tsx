import {useAuthData} from "@/hooks/useAuthData.ts";
import {Separator} from "@/components/ui/separator.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {EllipsisVertical, Monitor, Smartphone} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Sessions} from "@/components/auth.tsx";
import {useInvalidateSessionMutation} from "@/lib/mutations.ts";
import {useActiveSessionsQuery} from "@/lib/queries.ts";

export function ActiveSessionsForm() {
    const {authData} = useAuthData()

    const sessions = useActiveSessionsQuery()

    const currentSessionId = authData.mfaState?.id

    const invalidateSession = useInvalidateSessionMutation()

    function handleInvalidate(sessionId: string) {
        invalidateSession.mutate(sessionId)
    }

    if (!sessions) {
        return null
    } else {
        return (
            <div>
                <div className={"flex flex-col gap-4"}>
                    <div className={"flex flex-col gap-4"}>
                        <div>
                            <div className={"flex flex-row items-center justify-between"}>
                                <h1 className={"text-2xl font-semibold"}>Active Sessions</h1>
                            </div>
                            <Separator className={"my-3"}/>
                            <p className={"text-sm text-muted-foreground"}>Below is a list of devices that have accessed
                                your account. If you see any sessions you don’t recognize, please invalidate them.</p>
                        </div>
                    </div>
                    <div className={"flex h-[300px] w-full flex-col gap-3"}>
                        {
                            sessions.data?.map((session: Sessions) => {
                                const isCurrentSession = session.id === currentSessionId
                                const isMobileSession = /Mobi|Android/i.test(session["user-agent"]);
                                return <div className={"flex flex-col rounded border border-border p-4"}>
                                    <div
                                        className={`flex flex-row items-center gap-2 ${!isCurrentSession ? "justify-between" : ""}`}>
                                        <div
                                            className={"flex flex-row items-center gap-2"}>
                                            {isMobileSession ? <Smartphone/> : <Monitor className={"size-5"}/>}

                                            <p>{session["ip-address"]}</p>
                                        </div>
                                        {
                                            isCurrentSession && <Badge variant="outline"
                                                                       className="w-auto gap-1.5 border-green-500/50 text-green-500">
                                                Current Session
                                            </Badge>
                                        }
                                        {
                                            !isCurrentSession && <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <Button variant={"ghost"} size={"icon"}
                                                            className={"h-full w-auto"}><EllipsisVertical/></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem
                                                        onClick={() => handleInvalidate(session.id)}
                                                        className={"flex flex-row items-center gap-2 text-destructive"}>
                                                        Invalidate
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        }
                                    </div>
                                    <Separator className={"my-0.5 bg-transparent"}/>

                                    {/* User Agent */}
                                    <p className={"text-xs text-muted-foreground"}>
                                        <span className={"font-bold"}>User Agent:</span>
                                        {" "}{session["user-agent"]}
                                    </p>

                                    {/* Created */}
                                    <p className={"text-xs text-muted-foreground"}>
                                        <span className={"font-bold"}>Session Created:</span>
                                        {" "}{new Date(session.creation * 1000).toLocaleString()}
                                    </p>

                                    {/* Verified */}
                                    <p className={"text-xs text-muted-foreground"}>
                                        <span className={"font-bold"}>State:</span>
                                        {" "}{session["mfa-verified"] ? "Authenticated" : "Upgrading"}
                                    </p>

                                    <Separator className={"my-0.5 bg-transparent"}/>

                                    {/* UUID */}
                                    <p className={"text-xs italic text-muted-foreground/50"}>
                                        {session.id}
                                    </p>
                                    <p className={"text-xs text-muted-foreground"}></p>
                                </div>
                            })
                        }
                        <p className={"text-right text-xs text-muted-foreground/50"}>{sessions.data && sessions.data.length} Session{sessions.data && sessions.data?.length > 1 ? "s" : ""}</p>
                    </div>
                </div>
            </div>
        )
    }
}
