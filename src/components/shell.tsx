import React from "react";
import {Outlet, useLocation} from "react-router-dom";
import {AppSidebar} from "@/components/nav/app-sidebar"
import {Separator} from "@/components/ui/separator"
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar"
import {findRouteByPath, toTitleCase} from "@/lib/utils.ts";
import {Toaster} from "@/components/ui/sonner.tsx"
import {BreadcrumbItem, BreadcrumbResponsive} from "@/components/breadcrumbs"
import {routeMap} from "@/routing.tsx";
import {ErrorBoundary} from "@/components/error-boundary.tsx";
import Loading from "@/routes/loading.tsx";

const RouteFrame = ({children}: {children?: React.ReactNode}) => (
    <ErrorBoundary>
        <React.Suspense fallback={<Loading/>}>
            {children ?? <Outlet/>}
        </React.Suspense>
    </ErrorBoundary>
);

export function AuthShell({children}: { children?: React.ReactNode }): React.ReactElement {
    const {pathname} = useLocation();
    const breadcrumbs: string[] = pathname.split("/");

    const breadcrumbItems = React.useMemo((): BreadcrumbItem[] => {
        const bc = breadcrumbs;
        if (bc[0] === "") bc.splice(0, 1);
        return bc.map((path: string, i: number): BreadcrumbItem => {
            const href = "/" + bc.slice(0, i + 1).join("/")
            const label = findRouteByPath(routeMap, href ?? path)?.["breadcrumb"] ?? path
            return {
                label: label,
                href: href
            }
        })
    }, [breadcrumbs])

    React.useEffect(() => {
        const p = pathname.split("/");
        const title = toTitleCase(p[pathname.split("/").length - 1])
        if (title === "") {
            document.title = `Acme`;
        } else {
            document.title = `${toTitleCase(p[pathname.split("/").length - 1])} · Acme`;
        }
    }, [pathname])

    return (
        <div id={"auth"} data-vaul-drawer-wrapper="">
            <SidebarProvider>
                <AppSidebar/>
                <SidebarInset>
                    <div className={"flex flex-col"}>
                        {/* Main entry for content */}
                        <div className={"w-full self-center px-5 md:container"}>
                            <header
                                className="relative z-50 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                                <div className="flex items-center">
                                    <SidebarTrigger className="-ml-1.5"/>
                                    <Separator orientation="vertical" className="mr-2 h-4"/>
                                    <BreadcrumbResponsive items={breadcrumbItems}/>
                                </div>
                            </header>
                            <RouteFrame>{children}</RouteFrame>
                        </div>
                        {/* - */}
                    </div>
                    <Toaster/>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}

export function PublicShell({children}: {children?: React.ReactNode}): React.ReactElement {
    return (
        <div id={"public"}>
            <div className="flex min-h-screen w-full flex-col">
                <RouteFrame>{children}</RouteFrame>
            </div>
        </div>
    );
}