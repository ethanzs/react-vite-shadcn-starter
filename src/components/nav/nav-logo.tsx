import {Logo} from "@/components/ui/logo.tsx";
import {NavLink} from "react-router-dom";

export default function SidebarLogo() {
    return (
        <div
            className={`flex h-16 items-center px-4`}>
            <NavLink to={"/groups"}
                     className={`flex w-full items-center gap-2 fill-primary text-black transition-opacity hover:opacity-75 dark:text-white`}>
                <Logo size={22}
                      className={"fill-inherit transition-colors"}/>
                <h1 className={"text-base font-bold tracking-widest"}>Acme</h1>
            </NavLink>
        </div>
    )
}
