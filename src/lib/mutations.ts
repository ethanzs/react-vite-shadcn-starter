import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {
    DeleteManagementUsersEmailBackup,
    PatchManagementUsersEmailBackup,
    PatchSessionsInvalidate,
    PostManagementUsersEmailBackup,
    PostMfaSendEmail,
    PostMfaTotp,
    PostMfaTotpImage,
    PostMfaTotpValidate
} from "@/lib/api.ts";
import {routeMap} from "@/routing.tsx";
import {toast} from "sonner";

export function useEmailMfaMutation(mfaType: string | undefined) {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async () => {
            const response = await PostMfaSendEmail()
            if (!response.ok) {
                throw new Error('Failed to send email');
            }
            return await response.json();
        },
        onSuccess: () => {
            if (mfaType) navigate(routeMap.account.mfa.path + "/" + mfaType)
        },
    })
}

export function useMfaTotpMutation() {
    return useMutation({
        mutationFn: async (displayName: string) => {
            // Perform the email mutation logic here
            const response = await PostMfaTotp(displayName)

            if (!response.ok && response.status !== 409) {
                throw new Error('Failed to create TOTP');
            }

            const responseImage = await PostMfaTotpImage()

            if (!responseImage.ok) {
                throw new Error('Failed to get image');
            }

            return URL.createObjectURL(await responseImage.blob());
        },
    })
}

export function useMfaTotpValidateMutation() {
    return useMutation({
        mutationFn: async (code: string) => {
            // Perform the email mutation logic here
            const response = await PostMfaTotpValidate(code)

            if (!response.ok) {
                throw new Error('Failed to validate TOTP');
            }

            return "true";
        },
    })
}

export function useInvalidateSessionMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (sessionId: string) => {
            // Perform the email mutation logic here
            const response = await PatchSessionsInvalidate(sessionId)

            if (!response.ok) {
                throw new Error('Failed to invalidate the session');
            }

            return sessionId;
        },
        onSuccess: (sessionId: string) => {
            queryClient.invalidateQueries({queryKey: ['activeSessions']}).then(() => {
                toast("Session successfully invalidated", {
                    description: `Session ${sessionId} has been invalidated.`,
                    duration: 5000
                })
            })
        }
    })
}

export function useVerificationBackupEmailMutation() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (code: string) => {
            // Perform the email mutation logic here
            const response = await PatchManagementUsersEmailBackup(code)

            if (!response.ok) {
                throw new Error('Failed to verify the backup email.');
            }

            return code;
        },
        onSuccess: () => {
            navigate(routeMap.settings.account.path)
            toast("Successfully verified", {
                description: "Your backup email has successfully been verified.",
                duration: 15000,
            })
        },
        onError: () => {
            navigate(routeMap.settings.account.path)
            toast("Error verifying", {
                description: "There was an error verifying your backup email.",
                duration: 15000,
            })
        },
        retry: false,
    })
}

export function useAddVerificationBackupEmailMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (email: string) => {
            // Perform the email mutation logic here
            const response = await PostManagementUsersEmailBackup(email)

            if (!response.ok) {
                throw new Error('Failed to add the backup email.');
            }

            return email;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['backupEmails']}).then(() => {
                toast("Backup email added", {
                    description: "Check your email for the verification link.",
                    duration: 15000
                })
            })
        },
        onError: () => {
            toast("Error adding email", {
                description: "There was an error adding your backup email.",
                duration: 15000
            })
        }
    })
}

export function useDeleteBackupEmailMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (email: string) => {
            // Perform the email mutation logic here
            const response = await DeleteManagementUsersEmailBackup(email)

            if (!response.ok) {
                throw new Error('Failed to delete the backup email.');
            }

            return email;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['backupEmails']}).then(() => {
                toast("Backup email deleted", {
                    description: "Your backup email has been deleted.",
                    duration: 15000
                })
            })
        },
        onError: () => {
            toast("Error deleting email", {
                description: "There was an error deleting your backup email.",
                duration: 15000
            })
        }
    })
}