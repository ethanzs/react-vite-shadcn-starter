// Mapping of services to their corresponding API top level path

const SERVICES = {
    AUTH: "authentication-service",
    USER: "user-service",
    VERIFICATION: "verification-service",
}

const API_VERSION: string = "v1"

/**
 * Generates the base URL for the API endpoint.
 *
 * @param {string} endpoint - The API endpoint.
 *
 * @return {string} The generated base URL.
 */
export function generateAPIBaseURL(endpoint: string): string {
    const host = import.meta.env.VITE_ENVIRONMENT?.toLowerCase() === "development"
        ? "http://localhost:8443"
        : "https://" + import.meta.env.VITE_API_URL;
    const path = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    return `${host}/${API_VERSION}/${path}`;
}

export const ResponseMessages: { Login: Record<string, string> } = {
    Login: {
        "401": "Invalid credentials. Try again."
    }
}

const SIMULATE_AUTH = (): boolean => import.meta.env.VITE_SIMULATE_AUTH === "true";

function createFakeResponse(data: unknown, init: ResponseInit = {}): Response {
    const body = JSON.stringify(data);
    return new Response(body, {
        status: init.status || 200,
        statusText: init.statusText || 'OK',
        headers: {
            'Content-Type': 'application/json',
            ...(init.headers || {}),
        },
    });
}

export async function PostLogin(email: string, password: string): Promise<Response> {
    const endpoint = generateAPIBaseURL(SERVICES.AUTH + "/login");
    return await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password
        }),
        credentials: "include"
    });
}

export async function GetMfaState() {
    if (SIMULATE_AUTH()) {
        return createFakeResponse({
            id: "simulated",
            "user-entity-id": "simulated",
            "mfa-verified": true,
            "mfa-options": [],
            valid: true,
            expiration: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            creation: new Date().toISOString(),
        });
    }
    const endpoint = generateAPIBaseURL(SERVICES.AUTH + "/mfa/state");
    return await fetch(endpoint, {
        credentials: "include"
    });
}

/**
 * Retrieves information about the currently authenticated user.
 */
export async function GetUsersMe(): Promise<Response> {
    if (SIMULATE_AUTH()) {
        return createFakeResponse({
            id: 1,
            "authentication-service-id": 1,
            "user-service-id": 1,
            "verification-service-id": 1,
            email: "demo@example.com",
            "first-name": "Demo",
            "last-name": "User",
            "display-name": "demo",
            avatar: null,
            phone: "+12345678901",
            theme: "dark",
            marketing: true,
            creation: new Date().toISOString(),
            verified: true,
            modification: null,
            deletion: null,
            groups: null,
        })
    }
    const endpoint = generateAPIBaseURL(SERVICES.USER + "/@me");
    return await fetch(endpoint, {
        credentials: "include"
    });
}

export interface PostRegisterBody {
    email: string
    password: string
    "first-name": string
    "last-name": string
    phone: string
    consent: boolean
    type: string
}

export async function PostRegister(body: PostRegisterBody): Promise<Response> {
    const endpoint = generateAPIBaseURL(SERVICES.USER + "/register");
    return await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body)
    });
}

export interface PostMfaBody {
    code: string
}

export async function PostMfa(type: string, body: PostMfaBody): Promise<Response> {
    const endpoint = generateAPIBaseURL(SERVICES.AUTH + `/mfa/${type}/verify`);
    return await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body)
    });
}

export async function PostMfaSendEmail(): Promise<Response> {
    const endpoint = generateAPIBaseURL(SERVICES.AUTH + "/mfa/email/send");
    return await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({})
    });
}

export async function PostMfaTotp(displayName: string): Promise<Response> {
    const endpoint = generateAPIBaseURL(SERVICES.AUTH + "/mfa/totp");
    return await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            "display-name": displayName,
        })
    });
}

export async function PostMfaTotpImage(): Promise<Response> {
    const endpoint = generateAPIBaseURL(SERVICES.AUTH + "/mfa/totp/image");
    return await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({}),
    });
}

export async function PostMfaTotpValidate(code: string): Promise<Response> {
    const endpoint = generateAPIBaseURL(SERVICES.AUTH + "/mfa/totp/validate");
    return await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            code: code
        }),
    });
}


export async function GetLogout(): Promise<Response> {
    const endpoint = generateAPIBaseURL(SERVICES.AUTH + "/invalidate");
    return await fetch(endpoint, {
        credentials: "include"
    });
}

export async function GetUserOrganizations(): Promise<Response> {
    const endpoint = generateAPIBaseURL(SERVICES.USER + "/organizations");

    return await fetch(endpoint, {
        credentials: "include",
    });
}

export async function PostRegisterOrganization(name: string): Promise<Response> {
    const endpoint = generateAPIBaseURL(SERVICES.USER + "/organizations/register");

    return await fetch(endpoint, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
            name: name,
        })
    });
}

export async function GetActiveSessions(): Promise<Response> {
    const endpoint = generateAPIBaseURL(SERVICES.AUTH + "/sessions");
    return await fetch(endpoint, {
        credentials: "include",
    });
}

export async function PatchSessionsInvalidate(id: string): Promise<Response> {
    const endpoint = generateAPIBaseURL(SERVICES.AUTH + "/sessions/invalidate");
    return await fetch(endpoint, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({
            id
        })
    });
}

export async function PatchManagementUsersEmailBackup(code: string): Promise<Response> {
    const endpoint = generateAPIBaseURL(SERVICES.AUTH + "/management/users/email/backup");
    return await fetch(endpoint, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({
            code
        })
    });
}

export async function PostManagementUsersEmailBackup(email: string): Promise<Response> {
    const endpoint = generateAPIBaseURL(SERVICES.AUTH + "/management/users/email/backup");
    return await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            email
        })
    });
}

export async function DeleteManagementUsersEmailBackup(email: string): Promise<Response> {
    const endpoint = generateAPIBaseURL(SERVICES.AUTH + "/management/users/email/backup");
    return await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({
            email
        })
    });
}


export async function GetManagementUsersEmailBackup(): Promise<Response> {
    const endpoint = generateAPIBaseURL(SERVICES.AUTH + "/management/users/email/backup");
    return await fetch(endpoint, {
        method: "GET",
        credentials: "include",
    });
}