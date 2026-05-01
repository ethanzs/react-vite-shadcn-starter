import type {Context} from "react";
import React from "react";
import {TreeDataItem} from "@/components/tree-view.tsx";
import {useAuthDataQuery} from "@/lib/queries.ts";
import {fixtureGroups, isSimulatedAuth} from "@/lib/fixtures.ts";

export type Authenticated = "authenticated" | "unauthenticated" | "upgrading"

export interface AuthContextType {
    authenticated: Authenticated | null;
    setAuthenticated: React.Dispatch<React.SetStateAction<Authenticated | null>> | null;
    data: AuthContextData,
}

export interface AuthProviderPropType {
    children: React.ReactNode;
}

export const AuthContext: Context<AuthContextType> = React.createContext<AuthContextType>({
    authenticated: null,
    setAuthenticated: null,
    data: {
        me: undefined,
        mfaState: undefined,
        groups: undefined,
    },
});

export type AuthContextData = {
    me: Me | undefined;
    mfaState: MfaState | undefined;
    groups: Array<TreeDataItem> | undefined;
}

export type Me = {
    id: number;
    "authentication-service-id": number;
    "user-service-id": number;
    "verification-service-id": number;
    email: string;
    "first-name": string;
    "last-name": string;
    "display-name": string | null;
    avatar: string | null;
    phone: string;
    theme: "light" | "dark" | "system";
    marketing: boolean;
    creation: string;
    verified: boolean;
    modification: string | null;
    deletion: string | null;
    groups: Array<TreeDataItem> | null;
}

export type Sessions = {
    "id": string
    "valid": boolean
    "user-agent": string
    "ip-address": string
    "mfa-verified": boolean,
    "expiration": number,
    "creation": number
}

export type MfaState = {
    "id": string
    "user-entity-id": string
    "mfa-verified": boolean
    "mfa-options": Array<{
        "mfa-configuration-id": string
        "display-name": string
        "type": string
    }>
    "valid": boolean
    "expiration": string,
    "creation": string
}

export const AuthProvider = (props: AuthProviderPropType) => {
    const [authenticated, setAuthenticated] = React.useState<Authenticated | null>(null);

    const authData = useAuthDataQuery(true)

    // Combine all data into a memo
    const data = React.useMemo<AuthContextData>(() => {
        return {
            mfaState: authData.data?.mfaState,
            me: authData.data?.me,
            groups: isSimulatedAuth() ? fixtureGroups : authData.data?.me?.groups ?? undefined,
        }
    }, [authData.data])

    // Re-fetch 'me' query if authenticated is set to null (re-evaluation)
    React.useEffect(() => {
        if (authenticated === null) {
            authData.refetch().then(query => {
                if (query.isSuccess) {
                    if (query.data?.mfaState?.["mfa-verified"]) {
                        setAuthenticated("authenticated");
                    } else {
                        setAuthenticated("upgrading");
                    }
                } else if (query.isError) {
                    setAuthenticated("unauthenticated");
                }
            })
        }
    }, [authenticated, authData]);

    const value = React.useMemo<AuthContextType>(() => ({
        authenticated,
        setAuthenticated,
        data,
    }), [authenticated, data]);

    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};