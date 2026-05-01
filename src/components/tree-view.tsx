import React from 'react'
import {Accordion as AccordionPrimitive} from 'radix-ui'
import {ChevronRight, Component, EllipsisVertical, Users} from 'lucide-react'
import {cva} from 'class-variance-authority'
import {cn} from '@/lib/utils'
import {Button} from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger,} from "@/components/ui/context-menu"
import {Badge} from "@/components/ui/badge.tsx";
import {Link} from "react-router-dom";
import {countNodes, generateLink} from "@/lib/utils.ts";
import {routeMap} from "@/routing.tsx";
import {useGroup} from "@/hooks/useGroup.ts";

const treeVariants = cva(
    'group rounded border-muted px-2 font-semibold before:absolute before:left-0 before:-z-10 before:h-8 before:w-full before:rounded-lg before:bg-accent/70 before:opacity-0 hover:bg-muted/15 hover:before:opacity-100'
)

const selectedTreeVariants = cva(
    'text-accent-foreground before:bg-accent/70 before:opacity-100'
)

type TreeIconType = React.ComponentType<{ className?: string }>

interface TreeDataItem {
    id: string
    name: string
    description?: string
    icon?: TreeIconType
    selectedIcon?: TreeIconType
    openIcon?: TreeIconType
    children?: TreeDataItem[]
    actions?: React.ReactNode
    onClick?: () => void
    role?: string
    members: number
    plan?: "Free" | "Pro" | "Ultimate"
}

type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
    data: TreeDataItem[] | TreeDataItem
    initialSelectedItemId?: string
    onSelectChange?: (item: TreeDataItem | undefined) => void
    expandAll?: boolean
    defaultNodeIcon?: TreeIconType
    defaultLeafIcon?: TreeIconType
}

const TreeView = React.forwardRef<HTMLDivElement, TreeProps>(
    (
        {
            data,
            initialSelectedItemId,
            onSelectChange,
            expandAll,
            defaultLeafIcon,
            defaultNodeIcon,
            className,
            ...props
        },
        ref
    ) => {
        const [selectedItemId, setSelectedItemId] = React.useState<
            string | undefined
        >(initialSelectedItemId)

        const handleSelectChange = React.useCallback(
            (item: TreeDataItem | undefined) => {
                setSelectedItemId(item?.id)
                if (onSelectChange) {
                    onSelectChange(item)
                }
            },
            [onSelectChange]
        )

        const expandedItemIds = React.useMemo(() => {
            if (!initialSelectedItemId) {
                return [] as string[]
            }

            const ids: string[] = []

            function walkTreeItems(
                items: TreeDataItem[] | TreeDataItem,
                targetId: string
            ) {
                if (items instanceof Array) {
                    for (let i = 0; i < items.length; i++) {
                        ids.push(items[i]!.id)
                        if (walkTreeItems(items[i]!, targetId) && !expandAll) {
                            return true
                        }
                        if (!expandAll) ids.pop()
                    }
                } else if (!expandAll && items.id === targetId) {
                    return true
                } else if (items.children) {
                    return walkTreeItems(items.children, targetId)
                }
            }

            walkTreeItems(data, initialSelectedItemId)
            return ids
        }, [data, expandAll, initialSelectedItemId])

        return (
            <div className={cn('overflow-hidden relative p-2', className)}>
                <TreeItem
                    data={data}
                    ref={ref}
                    selectedItemId={selectedItemId}
                    handleSelectChange={handleSelectChange}
                    expandedItemIds={expandedItemIds}
                    defaultLeafIcon={defaultLeafIcon}
                    defaultNodeIcon={defaultNodeIcon}
                    {...props}
                />
            </div>
        )
    }
)
TreeView.displayName = 'TreeView'

type TreeItemProps = TreeProps & {
    selectedItemId?: string
    handleSelectChange: (item: TreeDataItem | undefined) => void
    expandedItemIds: string[]
    defaultNodeIcon?: TreeIconType
    defaultLeafIcon?: TreeIconType
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
    (
        {
            className,
            data,
            selectedItemId,
            handleSelectChange,
            expandedItemIds,
            defaultNodeIcon,
            defaultLeafIcon,
            ...props
        },
        ref
    ) => {
        if (!(data instanceof Array)) {
            data = [data]
        }
        return (
            <div ref={ref} role="tree" className={className} {...props}>
                <ul>
                    {data.map((item) => (
                        <li key={item.id}>
                            {item.children ? (
                                <TreeNode
                                    item={item}
                                    selectedItemId={selectedItemId}
                                    expandedItemIds={expandedItemIds}
                                    handleSelectChange={handleSelectChange}
                                    defaultNodeIcon={defaultNodeIcon}
                                    defaultLeafIcon={defaultLeafIcon}
                                />
                            ) : (
                                <TreeLeaf
                                    item={item}
                                    selectedItemId={selectedItemId}
                                    handleSelectChange={handleSelectChange}
                                    defaultLeafIcon={defaultLeafIcon}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
)
TreeItem.displayName = 'TreeItem'

const TreeNode = ({
                      item,
                      handleSelectChange,
                      expandedItemIds,
                      selectedItemId,
                      defaultNodeIcon,
                      defaultLeafIcon
                  }: {
    item: TreeDataItem
    handleSelectChange: (item: TreeDataItem | undefined) => void
    expandedItemIds: string[]
    selectedItemId?: string
    defaultNodeIcon?: TreeIconType
    defaultLeafIcon?: TreeIconType
}) => {
    const [value, setValue] = React.useState(
        expandedItemIds.includes(item.id) ? [item.id] : []
    )
    return (
        <AccordionPrimitive.Root
            type="multiple"
            value={value}
            onValueChange={(s) => setValue(s)}
        >
            <ContextMenu>
                <ContextMenuTrigger>
                    <AccordionPrimitive.Item value={item.id}>
                        <AccordionTrigger
                            className={cn(
                                treeVariants(),
                                selectedItemId === item.id && selectedTreeVariants()
                            )}
                            onClick={() => {
                                handleSelectChange(item)
                                item.onClick?.()
                            }}
                        >
                            <GroupHeader
                                item={item}
                                selectedItemId={selectedItemId}
                                defaultLeafIcon={defaultLeafIcon}
                            />

                            <TreeActions isSelected={selectedItemId === item.id}>
                                {item.actions}
                            </TreeActions>
                        </AccordionTrigger>
                        <AccordionContent className="ml-4 border-l pl-1">
                            <TreeItem
                                data={item.children ? item.children : item}
                                selectedItemId={selectedItemId}
                                handleSelectChange={handleSelectChange}
                                expandedItemIds={expandedItemIds}
                                defaultLeafIcon={defaultLeafIcon}
                                defaultNodeIcon={defaultNodeIcon}
                            />
                        </AccordionContent>
                    </AccordionPrimitive.Item>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem>Edit</ContextMenuItem>
                    <ContextMenuItem className={"text-destructive"}>Leave Group</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </AccordionPrimitive.Root>
    )
}

const TreeLeaf = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
    item: TreeDataItem
    selectedItemId?: string
    handleSelectChange: (item: TreeDataItem | undefined) => void
    defaultLeafIcon?: TreeIconType
}
>(
    (
        {
            className,
            item,
            selectedItemId,
            handleSelectChange,
            defaultLeafIcon,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'ml-5 flex text-left items-center py-2 cursor-pointer before:right-1',
                    treeVariants(),
                    className,
                    selectedItemId === item.id && selectedTreeVariants()
                )}
                onClick={() => {
                    handleSelectChange(item)
                    item.onClick?.()
                }}
                {...props}
            >

                <GroupHeader
                    item={item}
                    selectedItemId={selectedItemId}
                    defaultLeafIcon={defaultLeafIcon}
                />

                <TreeActions isSelected={selectedItemId === item.id}>
                    {item.actions}
                </TreeActions>
            </div>
        )
    }
)
TreeLeaf.displayName = 'TreeLeaf'

const GroupHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
    item: TreeDataItem
    selectedItemId?: string
    defaultLeafIcon?: TreeIconType
}
>(
    (
        {
            className,
            item,
            selectedItemId,
            defaultLeafIcon,
            ...props
        },
        ref
    ) => {
        const group = useGroup()

        return <div
            ref={ref}
            className={cn(
                className,
                "flex w-full flex-row items-center justify-between"
            )}
            {...props}
        >
            <div className={"flex flex-row items-center gap-2"}>
                <TreeIcon
                    item={item}
                    isSelected={selectedItemId === item.id}
                    default={defaultLeafIcon}
                />

                {/*Leaf Name*/}
                <div className={"flex flex-col items-start"}>
                    <div className={"flex flex-row items-center gap-2"}>
                        <Link
                            to={routeMap.groups.path + generateLink(group.groups, item.id) as string}
                            className="grow truncate text-sm hover:underline">{item.name}</Link>
                        {
                            // Your Role
                            item.role &&
                            <Badge variant={"outline"}
                                   className={"flex flex-row gap-1"}>{item.role}</Badge>
                        }
                    </div>

                    {item.description &&
                        <p className={"text-xs font-normal text-muted-foreground"}>{item.description}</p>}
                </div>
            </div>

            {/* Actions */}
            <GroupActions item={item}/>
        </div>
    }
)

const GroupActions = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
    item: TreeDataItem
}
>(
    (
        {
            className,
            item,
            ...props
        },
        ref
    ) => {
        return <div
            ref={ref}
            className={cn(
                className,
                "flex flex-row items-center gap-3"
            )}
            {...props}
        >
            <p className={"flex flex-row items-center gap-0.5 text-sm text-muted-foreground"}>
                <Component
                    className={"size-3.5"}/> {item.children ? countNodes(item.children) : 0} {/*TODO: Add num subgroup logic here*/}
            </p>
            <p className={"flex flex-row items-center gap-0.5 text-sm text-muted-foreground"}>
                <Users
                    className={"size-3.5"}/> {item.members}
            </p>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant={"ghost"}
                            className={"h-min p-2 hover:bg-transparent"}><EllipsisVertical/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>{item.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className={"text-destructive"}>Leave
                        Group</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    }
)

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({className, children, ...props}, ref) => (
    <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                'flex flex-1 w-full items-center py-2 transition-all [&[data-state=open]>svg]:first:rotate-90',
                className
            )}
            {...props}
        >
            <ChevronRight
                className="mr-1 size-4 shrink-0 text-accent-foreground/50 transition-transform duration-200"/>
            {children}
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({className, children, ...props}, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className={cn(
            'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
            className
        )}
        {...props}
    >
        <div className="pb-1 pt-0">{children}</div>
    </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

const TreeIcon = ({
                      item,
                      isOpen,
                      isSelected,
                      default: defaultIcon
                  }: {
    item: TreeDataItem
    isOpen?: boolean
    isSelected?: boolean
    default?: TreeIconType
}) => {
    let Icon = defaultIcon
    if (isSelected && item.selectedIcon) {
        Icon = item.selectedIcon
    } else if (isOpen && item.openIcon) {
        Icon = item.openIcon
    } else if (item.icon) {
        Icon = item.icon
    }
    const group = useGroup()
    return (<Link to={routeMap.groups.path + generateLink(group.groups, item.id) as string}>
        <div className="flex size-9 items-center justify-center rounded bg-primary/10">
            {
                Icon
                    ? <Icon className="size-full shrink-0 p-2 text-primary"/>
                    : <p className={"shrink-0 p-2 text-xl font-semibold text-primary"}>{item.name[0].toUpperCase()}</p>
            }
        </div>
    </Link>)
}

const TreeActions = ({
                         children,
                         isSelected
                     }: {
    children: React.ReactNode
    isSelected: boolean
}) => {
    return (
        <div
            className={cn(
                isSelected ? 'block' : 'hidden',
                'absolute right-3 group-hover:block'
            )}
        >
            {children}
        </div>
    )
}

export {
    TreeView, type
        TreeDataItem
}
