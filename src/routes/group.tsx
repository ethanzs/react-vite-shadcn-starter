import type {TreeDataItem} from "@/components/tree-view.tsx";
import {TreeView} from "@/components/tree-view.tsx";
import {Gem} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useGroup} from "@/hooks/useGroup.ts";

export default function Group() {
    const {
        isTopLevel,
        subgroup,
        group,
    } = useGroup()

    const item = isTopLevel ? group : subgroup

    // 4. If not found, show a "not found" message
    if (!item) {
        return <div>Group/Subgroup not found.</div>
    } else {
        return (
            <div className={"mt-6 flex flex-col gap-4"}>

                <div
                    className={"flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end"}>
                    <div className={"flex flex-col gap-4"}>

                        <div className={"flex flex-row items-center gap-4"}>
                            <div className={"flex size-12 items-center justify-center rounded bg-primary/10"}>
                                <p className={"text-3xl font-semibold uppercase text-primary"}>{item.name.charAt(0)}</p>
                            </div>
                            <h1 className={"text-3xl font-bold"}>{item.name}</h1>
                            {

                                isTopLevel && item.plan === "Ultimate" &&
                                <Badge variant={"default"}
                                       className={"pointer-events-none flex flex-row items-center gap-1 border border-primary bg-primary/50 drop-shadow-lg"}>
                                    <Gem className={"size-3.5"}/> {item.plan}
                                </Badge>
                            }
                            {

                                isTopLevel && item.plan === "Pro" &&
                                <Badge variant={"default"}
                                       className={"pointer-events-none flex flex-row items-center gap-1 border border-primary bg-primary/50"}>
                                    {item.plan}
                                </Badge>
                            }

                            {

                                isTopLevel && item.plan === "Free" &&
                                <Badge variant={"secondary"} className={"flex flex-row items-center gap-1"}>
                                    {item.plan}
                                </Badge>
                            }
                        </div>

                        {item.description && <p className={"text-muted-foreground"}>{item.description}</p>}
                    </div>

                    <div className={"flex flex-row items-center justify-end gap-4"}>
                        <div className={"flex flex-row gap-4"}>
                            <Button variant={"secondary"}>New Subgroup</Button>
                            <Button>New Engagement</Button>
                        </div>
                    </div>
                </div>


                <div className={"rounded border border-muted"}>
                    <TreeView data={item.children as TreeDataItem[]}/>
                </div>
            </div>

        )
    }
}
