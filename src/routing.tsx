
import React from "react";
import {createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider,} from "react-router-dom";
import {AuthShell, PublicShell} from "@/components/shell.tsx";
import {AuthContext, AuthContextType} from "@/components/auth.tsx"
import useSelectTheme from "@/hooks/useSelectTheme.ts";
import {Code, Cog, Lock, MonitorSmartphone, Settings2} from "lucide-react";

/*
 * Authenticated Routes
 */
const Groups = React.lazy(() => import("@/routes/groups.tsx"));
const Group = React.lazy(() => import("@/routes/group.tsx"));
const CreateGroup = React.lazy(() => import("@/routes/create-group/page"));
const Engagements = React.lazy(() => import("@/routes/engagements"));
// Settings
const Account = React.lazy(() => import("./routes/settings/layout.tsx"));
const AccountAccountForm = React.lazy(() => import("./routes/settings/account/page"));
const AccountAuthenticationForm = React.lazy(() => import("./routes/settings/authentication/page"));
const AccountAppearanceForm = React.lazy(() => import("./routes/settings/appearance/page"));
const AccountActiveSessionsForm = React.lazy(() => import("./routes/settings/active-sessions/page"));

/*
 * Public Routes
 */
// const Login = React.lazy(() => import("@/routes/login"));
const Authentication = React.lazy(() => import("@/routes/authentication/page"));
const Login = React.lazy(() => import("@/routes/authentication/login"));
const Signup = React.lazy(() => import("@/routes/authentication/signup"));
const MFA = React.lazy(() => import("@/routes/authentication/mfa.tsx"));

/*
 * Global Routes
 */
const Loading = React.lazy(() => import("@/routes/loading"));
const NotFound = React.lazy(() => import("@/routes/notfound"));
const VerifyEmail = React.lazy(() => import("@/routes/verify-email.tsx"));

/*
 * Route Map
 */
export const routeMap = {
    // Public Routes
    "account": {
        "base": {breadcrumb: "Account", path: "/account"},
        "login": {breadcrumb: "Login", path: "/account/login"},
        "signup": {breadcrumb: "Signup", path: "/account/signup"},
        "mfa": {breadcrumb: "MFA", path: "/account/mfa"},
    },

    // Private
    "dashboard": {breadcrumb: "Dashboard", path: "/dashboard"},
    "groups": {breadcrumb: "Groups", path: "/groups"},
    "createGroup": {breadcrumb: "Create", path: "/groups/create"},
    "engagements": {breadcrumb: "Engagements", path: "/engagements"},
    "settings": {
        "base": {
            breadcrumb: "Settings",
            path: "/settings",
        },
        "account": {
            breadcrumb: "Account",
            path: "/settings/account",
            icon: <Cog/>
        },
        "authentication": {
            breadcrumb: "Authentication",
            path: "/settings/authentication",
            icon: <Lock/>
        },
        "preferences": {
            breadcrumb: "Preferences",
            path: "/settings/preferences",
            icon: <Settings2/>
        },
        "activeSessions": {
            breadcrumb: "Active Sessions",
            path: "/settings/active-sessions",
            icon: <MonitorSmartphone/>
        },
        "accessTokens": {
            breadcrumb: "Developer",
            path: "/settings/developer",
            icon: <Code/>
        },
    },

    // Global
    "notFound": {breadcrumb: "404", path: "/404"},
    "verifyEmail": {breadcrumb: "Verify Email", path: "/verify-email"}
}


// The route tree is auth-state-dependent: each auth state mounts a different
// set of routes. Building the router is expensive, so we memoize on auth state.
function buildRouter(authenticated: AuthContextType["authenticated"]) {
    return createBrowserRouter(
        createRoutesFromElements(
            authenticated === null
                ? <Route path={"*"} element={<Loading/>}/>
                : authenticated === "authenticated"
                    ? <Route element={<AuthShell/>}>
                        <Route path={"/"} element={<Groups/>} index={true}/>
                        <Route path={routeMap.verifyEmail.path} element={<VerifyEmail/>}/>
                        <Route path={routeMap.groups.path} element={<Groups/>}/>
                        <Route path={routeMap.createGroup.path} element={<CreateGroup/>}/>
                        <Route path={`${routeMap.groups.path}/:group/*`} element={<Group/>}/>
                        <Route path={routeMap.engagements.path} element={<Engagements/>}/>
                        <Route path={routeMap.settings.base.path}
                               element={<Navigate to={routeMap.settings.account.path}/>}/>
                        <Route element={<Account/>}>
                            <Route path={routeMap.settings.account.path} element={<AccountAccountForm/>}/>
                            <Route path={routeMap.settings.authentication.path}
                                   element={<AccountAuthenticationForm/>}/>
                            <Route path={routeMap.settings.preferences.path} element={<AccountAppearanceForm/>}/>
                            <Route path={routeMap.settings.accessTokens.path} element={<h1>Coming soon</h1>}/>
                            <Route path={routeMap.settings.activeSessions.path}
                                   element={<AccountActiveSessionsForm/>}/>
                        </Route>
                        <Route path={routeMap.notFound.path} element={<NotFound/>}/>
                        <Route path="*" element={<Navigate to={routeMap.notFound.path}/>}/>
                    </Route>
                    : authenticated === "upgrading"
                        ? <Route element={<PublicShell/>}>
                            <Route path={routeMap.verifyEmail.path} element={<VerifyEmail/>}/>
                            <Route element={<Authentication/>}>
                                <Route path={routeMap.account.mfa.path + "/:option"} element={<MFA/>}/>
                                <Route path={routeMap.account.mfa.path + "/"} element={<MFA/>}/>
                            </Route>
                            <Route path={"*"} element={<Navigate to={routeMap.account.mfa.path}/>}/>
                        </Route>
                        : <Route element={<PublicShell/>}>
                            <Route path={"/"} element={<Navigate to={routeMap.account.login.path}/>}/>
                            <Route path={routeMap.verifyEmail.path} element={<VerifyEmail/>}/>
                            <Route path={routeMap.account.base.path}
                                   element={<Navigate to={routeMap.account.login.path}/>}/>
                            <Route element={<Authentication/>}>
                                <Route path={routeMap.account.login.path} element={<Login/>}/>
                                <Route path={routeMap.account.signup.path} element={<Signup/>}/>
                            </Route>
                            <Route path={routeMap.notFound.path} element={<NotFound/>}/>
                            <Route path={"*"} element={<Navigate to={routeMap.account.login.path}/>}/>
                        </Route>
        )
    )
}

export default function Routing() {
    useSelectTheme();
    const {authenticated} = React.useContext<AuthContextType>(AuthContext);
    const router = React.useMemo(() => buildRouter(authenticated), [authenticated]);
    return <RouterProvider router={router}/>;
}
