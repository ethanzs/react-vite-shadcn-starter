import React from "react";
import {AuthContext, AuthContextType} from "@/components/auth.tsx";

export function useAuthData() {
    // Get user's group from authContext
    const authContext: AuthContextType = React.useContext(AuthContext);

    return {
        authData: authContext.data,
        authenticated: authContext.authenticated
    }
}

