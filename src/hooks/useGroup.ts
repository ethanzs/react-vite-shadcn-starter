import React from "react";
import {AuthContext, AuthContextType} from "@/components/auth.tsx";
import {useLocation, useParams} from "react-router-dom";
import {findItemBySegments} from "@/lib/utils.ts";
import type {TreeDataItem} from "@/components/tree-view.tsx";

const reservedWords: string[] = [
    "create",
    "new",
    "edit",
    "update",
    "delete",
    "admin",
    "settings",
    "dashboard",
    "login",
    "logout",
    "signup",
    "register",
    "profile",
    "api",
    "assets",
    "uploads",
    "help",
    "explore",
    "search",
    "discover"
];

export function useGroup() {
    // Get user's group from authContext
    const authContext: AuthContextType = React.useContext(AuthContext);
    const groups: TreeDataItem[] = authContext.data?.groups ?? [];

    // Location handling
    // Get the params for top level group (:group)
    const params = useParams();
    // Get the entire location, e.g. /groups/demo-org/platform-team
    const location = useLocation();
    // We only want the part after /groups/ -> "demo-org/platform-team"
    // Replace "/groups/" with empty and split by "/"
    const pathAfterGroups: string = location.pathname.replace(/^\/groups\//, '')
    const segments: string[] = pathAfterGroups.split('/').filter(Boolean) // e.g. ["demo-org", "platform-team"]

    // Extract values
    const isOnGroupPage: boolean = location.pathname.startsWith("/groups/") && !reservedWords.includes(segments[0]);
    const isTopLevel: boolean = isOnGroupPage && segments.length === 1
    const group: TreeDataItem | undefined = findItemBySegments(groups, [params.group as string])
    const subgroup: TreeDataItem | undefined = findItemBySegments(groups, segments)

    return {
        groups,
        group,
        subgroup,
        isTopLevel,
        isOnGroupPage
    }
}

