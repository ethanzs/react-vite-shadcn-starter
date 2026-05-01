import * as React from "react"
import {AudioWaveform, ChevronsUpDown, Ghost, Plus} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,} from "@/components/ui/sidebar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {TreeDataItem} from "@/components/tree-view.tsx";

export function GroupSwitcher({
                                  groups,
                              }: {
    groups: TreeDataItem[]
}) {
    const {isMobile} = useSidebar()
    const [activeGroup, setActiveGroup] = React.useState(groups[0] ?? {
        name: "",
        logo: Ghost,
        plan: ""
    })

    const [open, setOpen] = React.useState(false)

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <div
                                    className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    {/*<activeTeam.logo className="size-4"/>*/}
                                    <AudioWaveform className="size-4"/>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeGroup.name}
                </span>
                                    <span className="truncate text-xs">{activeGroup.plan}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto"/>
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            align="start"
                            side={isMobile ? "bottom" : "right"}
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                Groups
                            </DropdownMenuLabel>
                            {groups.map((group) => (
                                <DropdownMenuItem
                                    key={group.name}
                                    onClick={() => setActiveGroup(group)}
                                    className="gap-2 p-2"
                                >
                                    <div className="flex size-6 items-center justify-center rounded-sm border">
                                        {/*<group.logo className="size-4 shrink-0"/>*/}
                                        <AudioWaveform className="size-4 shrink-0"/>
                                    </div>
                                    {group.name}
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator/>

                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger className={"w-full"}>
                                    <DropdownMenuItem className="gap-2 p-2" onSelect={(e) => e.preventDefault()}>
                                        <div
                                            className="flex size-6 items-center justify-center rounded-md border bg-background">
                                            <Plus className="size-4"/>
                                        </div>

                                        <div className="font-medium text-muted-foreground">Create</div>
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create a Team</DialogTitle>
                                        <DialogDescription>
                                            Create a new team.
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </>
    )
}
