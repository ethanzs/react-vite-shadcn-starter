import * as React from "react"
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {Button} from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {Link} from "react-router-dom";
import {useIsMobile} from "@/hooks/use-mobile";

const ITEMS_TO_DISPLAY = 4

export interface BreadcrumbItem {
    href?: string
    label: string
}

export interface BreadcrumbResponsiveProps extends React.HTMLAttributes<HTMLDivElement> {
    items: BreadcrumbItem[]
}

export function BreadcrumbResponsive({items}: BreadcrumbResponsiveProps) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = !useIsMobile()

    // To make sure the startIndex is alway > 0
    const startIndex = (items.length - ITEMS_TO_DISPLAY < 0) ? 1 : -ITEMS_TO_DISPLAY + 1

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink
                        asChild
                        className="max-w-20 truncate md:max-w-none"
                    >
                        <Link to={items[0].href as string}>{items[0].label}
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {items.length > 1 && <BreadcrumbSeparator/>}

                {items.length > ITEMS_TO_DISPLAY ? (
                    <>
                        <BreadcrumbItem>
                            {isDesktop ? (
                                <DropdownMenu open={open} onOpenChange={setOpen}>
                                    <DropdownMenuTrigger
                                        className="flex items-center gap-1"
                                        aria-label="Toggle menu"
                                    >
                                        <BreadcrumbEllipsis className="size-4"/>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        {items.slice(1, -1).map((item, index) => (
                                            <DropdownMenuItem key={index}>
                                                <Link to={item.href ? item.href : "#"}>
                                                    {item.label}
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Drawer open={open} onOpenChange={setOpen}>
                                    <DrawerTrigger aria-label="Toggle Menu">
                                        <BreadcrumbEllipsis className="size-4"/>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader className="text-left">
                                            <DrawerTitle>Navigate to</DrawerTitle>
                                            <DrawerDescription>
                                                Select a page to navigate to.
                                            </DrawerDescription>
                                        </DrawerHeader>
                                        <div className="grid gap-1 px-4">
                                            {items.slice(1, -1).map((item, index) => (
                                                <Link
                                                    key={index}
                                                    to={item.href ? item.href : "#"}
                                                    className="py-1 text-sm"
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                        <DrawerFooter className="pt-4">
                                            <DrawerClose asChild>
                                                <Button variant="outline">Close</Button>
                                            </DrawerClose>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>
                            )}
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                    </>
                ) : null}
                {items.slice(startIndex).map((item, index) => (
                    <BreadcrumbItem key={index}>
                        {item.href ? (
                            <>
                                <BreadcrumbLink
                                    asChild
                                    className="max-w-20 truncate md:max-w-none"
                                >
                                    <Link to={item.href}>{item.label}</Link>
                                </BreadcrumbLink>

                                {index < items.length - 2 && <BreadcrumbSeparator/>}
                            </>
                        ) : (
                            <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
                                {item.label}
                            </BreadcrumbPage>
                        )}
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
