import {TreeView} from "@/components/tree-view.tsx";
import {Filter} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useGroup} from "@/hooks/useGroup.ts";
import {useNavigate} from "react-router-dom";
import {routeMap} from "@/routing.tsx";

export default function Groups() {
    const group = useGroup()
    const navigate = useNavigate();

    return (
        <div className={"mt-6 flex flex-col gap-4"}>
            <h1 className={"text-3xl font-bold"}>Groups</h1>
            <div className={"flex flex-row gap-4"}>
                <Input placeholder={"Search..."} className={""}/>
                <Button variant={"outline"}><Filter/> Filter</Button>
                <Button onClick={() => navigate(routeMap.createGroup.path)}>Create Group</Button>
            </div>

            <div className={"rounded border border-muted"}>
                <TreeView data={group.groups}/>
            </div>
        </div>

    )
}