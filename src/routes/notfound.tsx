import React from "react";
import {Logo} from "@/components/ui/logo.tsx";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {ArrowLeft} from "lucide-react";
import {AuthContext} from "@/components/auth.tsx";

export default function NotFound() {
    const navigate = useNavigate();
    const authContext = React.useContext(AuthContext);

    return (
        <div
            className="absolute left-0 top-0 flex size-full flex-row items-center justify-center gap-2">
            <Button onClick={() => authContext.authenticated === "authenticated" ? navigate(-1) : navigate("/")}
                    variant={"outline"}
                    className={`absolute ${authContext.authenticated === "authenticated" ? "left-4 top-16" : "left-8 top-8"}`}><ArrowLeft/> Back</Button>
            <Logo size={22}
                  className={"animate-pulse fill-primary drop-shadow-md"}/>
            <h1 className={"font-semibold tracking-wider text-primary drop-shadow-md"}>
                404
            </h1>
        </div>
    )
}
