import * as React from "react"
import {CloudUpload, Cog, Component, LifeBuoy, Pin, Send} from "lucide-react"

import {NavMain} from "@/components/nav/nav-main"
import {NavSecondary} from "@/components/nav/nav-secondary"
import {NavUser} from "@/components/nav/nav-user"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar"
import SidebarLogo from "@/components/nav/nav-logo.tsx"
import {useLocation} from "react-router-dom";
import {AuthContext} from "@/components/auth.tsx";
import {routeMap} from "@/routing.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {useGroup} from "@/hooks/useGroup.ts";

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const authContext = React.useContext(AuthContext);

    const {pathname} = useLocation();

    const {group, isOnGroupPage, subgroup} = useGroup();
    const me = authContext.data?.me

    const navUser = [
        {
            title: "Groups",
            url: routeMap.groups.path,
            icon: Component,
            isActive: pathname === routeMap.groups.path,
            items: [
                // {
                //     title: "Groups",
                //     url: routeMap.groups,
                //     isActive: pathname === routeMap.groups,
                // },
            ],
        },
        {
            title: "Engagements",
            url: routeMap.engagements.path,
            icon: CloudUpload,
            isActive: pathname === routeMap.engagements.path,
            items: [],
        },
    ]

    const navGroup = [
        {
            title: "Pinned",
            url: routeMap.groups.path,
            icon: Pin,
            isActive: true,
            items: [
                {
                    title: "Pipelines",
                    url: routeMap.groups.path,
                    // isActive: pathname === routeMap.groups,
                },
                {
                    title: "Members",
                    url: routeMap.groups.path,
                    // isActive: pathname === routeMap.groups,
                },
            ],
        },
        {
            title: "Settings",
            url: routeMap.engagements.path,
            icon: Cog,
            isActive: pathname === routeMap.engagements.path,
            items: [
                {
                    title: "General",
                    url: routeMap.groups.path,
                    // isActive: pathname === routeMap.groups,
                },
                {
                    title: "Roles and Permissions",
                    url: routeMap.groups.path,
                    // isActive: pathname === routeMap.groups,
                },
                {
                    title: "Integrations",
                    url: routeMap.groups.path,
                    // isActive: pathname === routeMap.groups,
                },
                {
                    title: "Access Tokens",
                    url: routeMap.groups.path,
                    // isActive: pathname === routeMap.groups,
                },
                {
                    title: "Billing",
                    url: routeMap.groups.path,
                    // isActive: pathname === routeMap.groups,
                },
            ],
        },
    ]

    const data = {
        user: {
            name: me?.["first-name"] && me?.["last-name"] ? (me?.["first-name"] + " " + me?.["last-name"]) : "John Smith",
            email: me?.email as string,
            avatar: me?.avatar as string,
        },
        // groups: authContext?.data?.groups,
        navMain: isOnGroupPage ? navGroup : navUser,
        navSecondary: [
            {
                title: "Support",
                url: "#",
                icon: LifeBuoy,
            },
            {
                title: "Feedback",
                url: "#",
                icon: Send,
            },
        ],
        recentGroups: [
            {
                name: "demo-org",
                url: routeMap.groups.path + "/demo-org",
                active: location.pathname === routeMap.groups.path + "/demo-org"
            },
            {
                name: "sample-team",
                url: routeMap.groups.path + "/sample-team",
                active: location.pathname === routeMap.groups.path + "/sample-team"
            },
        ],
    }

    return (
        <Sidebar variant={"sidebar"} collapsible="offcanvas" {...props}>
            <SidebarLogo/>
            <Separator orientation="horizontal"/>
            {
                isOnGroupPage
                    ? <SidebarHeader className={"border-b border-muted"}>
                        <div className={"flex flex-row items-center gap-2 p-2"}>
                            <div className={"size-6 rounded bg-primary/20"}>
                                <p className={"flex items-center justify-center font-semibold uppercase text-primary"}>{subgroup?.name.charAt(0)}</p>
                            </div>
                            <p className={"text-sm font-semibold"}>{group?.name}</p>
                        </div>
                        {/*<Button variant={"outline"}><Search/> Search</Button>*/}
                        {/*<GroupSwitcher groups={data.groups}/>*/}
                    </SidebarHeader>
                    : null
            }

            <SidebarContent>
                <NavMain items={data.navMain}/>
                {/*<NavGroups groups={data.recentGroups}/>*/}
                <NavSecondary items={data.navSecondary} className="mt-auto"/>
            </SidebarContent>
            <Separator orientation="horizontal"/>
            <SidebarFooter>
                <NavUser user={data.user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
