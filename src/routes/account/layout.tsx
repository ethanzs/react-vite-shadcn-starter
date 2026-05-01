import {Separator} from "@/components/ui/separator"
import {SidebarNav} from "./components/sidebar-nav.tsx"
import {Outlet} from "react-router-dom";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {routeMap} from "@/routing.tsx";
import {useAuthData} from "@/hooks/useAuthData.ts";
import {getInitials} from "@/lib/utils.ts";
import type {JSX} from "react";

const sidebarNavItems = Object.entries(routeMap.settings)
    // Optionally skip the "base" route if you don't want it in your sidebar:
    .filter((entry): entry is [string, { breadcrumb: string; path: string; icon: JSX.Element }] => {
        const [key, item] = entry
        return key !== "base" && "icon" in item
    })
    // Map each entry to an object with title and href:
    .map(([, item]) => ({
        title: item.breadcrumb,
        href: item.path,
        icon: item.icon
    }));


export default function SettingsLayout() {
    const {authData} = useAuthData()

    return (
        <>
            <div className="flex flex-col gap-6 py-16">
                <div className="flex flex-row items-center gap-3">
                    <Avatar className="size-14">
                        <AvatarImage src={authData.me?.avatar ?? undefined}
                                     alt="User avatar"/>
                        <AvatarFallback>{getInitials(authData.me?.["first-name"] ?? "", authData.me?.["last-name"] ?? "")}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold">{authData.me?.["first-name"]} {authData.me?.["last-name"]}</h1>
                        <p className={"text-muted-foreground"}>{authData.me?.email}</p>
                    </div>
                </div>
                <Separator/>
                <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                    <aside className="lg:w-1/5 lg:shrink-0">
                        <SidebarNav items={sidebarNavItems}/>
                    </aside>
                    <div className="min-w-0 flex-1">
                        <Outlet/>
                    </div>
                </div>
            </div>
        </>
    )
}
