import {Logo} from "@/components/ui/logo.tsx";
import Particles from "@/components/ui/particles";
import {useIsMobile} from "@/hooks/use-mobile";
import {useIsDarkMode} from "@/hooks/useIsDarkMode";
import {Link, Outlet} from "react-router-dom";

export default function AuthenticationPage() {
    const isMobile = useIsMobile();
    const isDark = useIsDarkMode();

    return (
        <div
            id={"main"}
            className="relative h-screen flex-col items-center justify-center overflow-hidden md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-foreground dark:bg-black dark:text-white dark:border-r lg:flex">
                <div className="absolute inset-0 overflow-hidden bg-muted dark:bg-black">
                    {
                        isMobile
                            ? null
                            : <Particles
                                className="absolute inset-0"
                                quantity={150}
                                ease={80}
                                color={isDark ? "#FFFFFF" : "#000000"}
                                refresh
                            />
                    }
                </div>
                <div className={"relative z-20 flex items-center justify-between"}>
                    <Link to={"/"}
                          className={"flex items-center gap-2 text-lg transition-all hover:text-primary"}>
                        <Logo size={32} className={"text-primary"}/>
                        <h1 className={"font-semibold"}>Acme, Inc</h1>
                    </Link>
                </div>
                <div className="relative z-20 mt-auto">
                    <p className="text-sm text-muted-foreground">
                        A React + Vite + shadcn/ui starter kit.
                    </p>
                </div>
            </div>

            <Outlet/>
        </div>
    )
}
