import {Link, useNavigate} from "react-router-dom"
import {SignupForm} from "./components/signup-form.tsx"
import {Button} from "@/components/ui/button.tsx";
import {ArrowLeft} from "lucide-react";
import {routeMap} from "@/routing.tsx";

export default function Signup() {
    const navigate = useNavigate();

    return (
        <>
            <div
                className={`relative flex size-full flex-row items-center justify-center p-6`}>
                <Button onClick={() => navigate(routeMap.account.login.path)}
                        variant={"outline"}
                        className={`absolute left-8 top-8`}><ArrowLeft/> Sign In</Button>
                <div
                    className={`flex h-full flex-col items-center justify-center`}>
                    <div className="lg:p-8">
                        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]">

                            <div className="flex flex-col space-y-2">
                                <h1 className={"text-left text-4xl font-bold"}>Ready to penetrate?</h1>
                                <p className="text-sm text-muted-foreground">
                                    Fill out the forms below to create your account
                                </p>
                            </div>

                            <SignupForm/>

                            <p className="px-8 text-center text-sm text-muted-foreground">
                                By clicking Sign Up, you agree to our{" "}
                                <Link
                                    to="/terms"
                                    className="underline underline-offset-4 hover:text-primary"
                                >
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                    to="/privacy"
                                    className="underline underline-offset-4 hover:text-primary"
                                >
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
