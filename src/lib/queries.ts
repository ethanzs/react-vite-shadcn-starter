import {useQuery, UseQueryResult} from "@tanstack/react-query";
import * as API from "@/lib/api.ts";
import {GetActiveSessions, GetManagementUsersEmailBackup, GetMfaState} from "@/lib/api.ts";
import {Sessions} from "@/components/auth.tsx";

export function useAuthDataQuery(enabled: boolean = true) {
    return useQuery({
        queryKey: ["authData"],
        queryFn: async () => {
            // - Determine user's authenticated state - //
            // NOTE: This will get refactored
            const stateResponse = await GetMfaState();

            // - If 'unauthenticated' - //
            if (!stateResponse.ok) {
                throw new Error('Failed to get MFA state');
            }

            const mfaState = await stateResponse.json();

            // - If 'upgrading' - //
            if (!mfaState["mfa-verified"]) {
                return {
                    mfaState,
                    me: undefined,
                }
            }

            // - If 'authenticated' - //
            const endpoints = [
                await API.GetUsersMe(),
            ]

            const responses = await Promise.all(endpoints);

            if (responses.some(res => !res.ok)) {
                throw new Error('Failed to fetch one or more requests');
            }

            const [me] = await Promise.all(
                responses.map(res => res.json())
            );

            return {
                mfaState,
                me
            }
        },
        enabled: enabled,
        retry: false
    })
}

export function useActiveSessionsQuery(enabled: boolean = true): UseQueryResult<Array<Sessions>, Error> {
    return useQuery({
        queryKey: ["activeSessions"],
        queryFn: async () => {

            // Perform the email mutation logic here
            const response = await GetActiveSessions()

            if (!response.ok) {
                throw new Error('Failed to get active sessions');
            }

            return await response.json();
        },
        enabled: enabled
    })
}

export function useMeQuery(enabled: boolean = true) {
    return useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const response = await API.GetUsersMe()

            if (!response.ok) {
                throw new Error()
            }

            return await response.json();
        },
        retry: false,
        enabled: enabled
    })
}

// This is needed in order to redirect users away from the OTP page if they are not in the 'upgrading' auth state.
export function useMfaStateQuery(enabled: boolean = true) {
    return useQuery({
        queryKey: ["mfaState"],
        queryFn: async () => {
            const response = await GetMfaState();

            if (!response.ok) throw new Error()

            return await response.json()
        },
        retry: false,
        enabled: enabled
    })
}

export type BackupEmail = {
    "backup-email": string
    "backup-email-verified": boolean
}

export function useGetBackupEmailsQuery() {
    return useQuery<BackupEmail[]>({
        queryKey: ["backupEmails"],
        queryFn: async () => {
            const response = await GetManagementUsersEmailBackup()

            if (!response.ok) {
                throw new Error('Failed to add the backup email.');
            }

            return await response.json();
        },
    })
}