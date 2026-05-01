import type * as React from "react"
import {cva, type VariantProps} from "class-variance-authority"
import {X} from "lucide-react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"

const bannerVariants = cva("relative flex w-full items-center justify-between gap-4 border px-4 py-3 text-sm", {
    variants: {
        variant: {
            default: "rounded bg-background text-foreground",
            destructive: "rounded border-destructive/50 bg-destructive/15 text-destructive dark:text-destructive [&>svg]:text-destructive",
            success: "rounded border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-500",
            warning: "rounded border-yellow-500/50 bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-500",
            primary: "rounded bg-sidebar text-primary",
        },
    },
    defaultVariants: {
        variant: "default",
    },
})

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof bannerVariants> {
    icon?: React.ReactNode
    title?: string
    description?: string
    action?: React.ReactNode
    dismissible?: boolean
    onDismiss?: () => void
}

export function Banner({
                           className,
                           variant,
                           icon,
                           title,
                           description,
                           action,
                           dismissible = true,
                           onDismiss,
                           ...props
                       }: BannerProps) {
    return (
        <div className={cn(bannerVariants({variant}), className)} {...props}>
            <div className="flex flex-1 gap-2">
                {icon && <div className="shrink-0">{icon}</div>}
                <div className={"flex flex-col items-center justify-center"}>
                    {title && <p className="font-semibold text-black dark:text-white">{title}</p>}
                    {description &&
                        <p className="text-sm text-black dark:text-muted-foreground">{description}</p>}
                </div>
            </div>
            {action && <div className="shrink-0">{action}</div>}
            {dismissible && onDismiss && (
                <Button variant="ghost" size="icon" className="absolute right-1 top-1 size-8 rounded-md"
                        onClick={onDismiss}>
                    <X className="size-4"/>
                    <span className="sr-only">Dismiss</span>
                </Button>
            )}
        </div>
    )
}

