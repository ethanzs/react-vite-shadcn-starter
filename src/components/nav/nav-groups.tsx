import {type LucideIcon, MoreHorizontal, Squircle,} from "lucide-react"

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {Link} from "react-router-dom";

export function NavGroups({
                              groups,
                          }: {
    groups: {
        name: string
        url: string
        icon: LucideIcon
        active: boolean
    }[]
}) {
    const {isMobile} = useSidebar()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Recent Groups</SidebarGroupLabel>
            <SidebarMenu>
                {groups.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={item.active}>
                            <Link to={item.url}>
                                {item.icon && <item.icon/> || <Squircle/>}
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction showOnHover>
                                    <MoreHorizontal/>
                                    <span className="sr-only">More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-48 rounded-lg"
                                side={isMobile ? "bottom" : "right"}
                                align={isMobile ? "end" : "start"}
                            >
                                <DropdownMenuItem>
                                    {/*<Component className="text-muted-foreground"/>*/}
                                    <span>View Group</span>
                                </DropdownMenuItem>
                                {/*<DropdownMenuItem>*/}
                                {/*    <Forward className="text-muted-foreground"/>*/}
                                {/*    <span>Share Project</span>*/}
                                {/*</DropdownMenuItem>*/}
                                {/*<DropdownMenuSeparator/>*/}
                                {/*<DropdownMenuItem>*/}
                                {/*    <Trash2 className="text-muted-foreground"/>*/}
                                {/*    <span>Delete Project</span>*/}
                                {/*</DropdownMenuItem>*/}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
                {/*<SidebarMenuItem>*/}
                {/*    <SidebarMenuButton className="text-sidebar-foreground/70">*/}
                {/*        <MoreHorizontal className="text-sidebar-foreground/70"/>*/}
                {/*        <span>More</span>*/}
                {/*    </SidebarMenuButton>*/}
                {/*</SidebarMenuItem>*/}
            </SidebarMenu>
        </SidebarGroup>
    )
}
