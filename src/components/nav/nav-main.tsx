import {ChevronRight, type LucideIcon} from "lucide-react"

import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {NavLink} from "react-router-dom";
import {useGroup} from "@/hooks/useGroup.ts";

export function NavMain({
                            items,
                        }: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
}) {

    const group = useGroup()

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{group.isOnGroupPage && "Group" || "General"}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    if (item?.items && item.items.length > 0) {
                        return <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={item.isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={item.title}>
                                        {item.icon && <item.icon/>}
                                        <span>{item.title}</span>
                                        <ChevronRight
                                            className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <NavLink to={subItem.url}>
                                                        <span>{subItem.title}</span>
                                                    </NavLink>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    } else {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
                                    <NavLink to={item.url}>
                                        {item.icon && <item.icon/>}
                                        <span>{item.title}</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    }
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
