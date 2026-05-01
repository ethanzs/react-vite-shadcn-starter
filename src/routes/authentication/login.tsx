import {Link} from "react-router-dom"
import {UserAuthForm} from "./components/user-auth-form.tsx"

export default function Login() {
    return (
        <>
            <div
                className={`relative flex size-full flex-row items-center justify-center p-6`}>
                <div
                    className={`flex h-full flex-col items-center justify-center`}>
                    <div className="lg:p-8">
                        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">

                            <div className="flex flex-col space-y-2 text-center">
                                {/*<h1 className="text-2xl font-semibold tracking-tight">*/}
                                {/*    Create an account*/}
                                {/*</h1>*/}
                                <h1 className={"text-center text-3xl font-bold"}>Sign In</h1>
                                <p className="text-sm text-muted-foreground">
                                    Enter your email below to login or create your account
                                </p>
                            </div>

                            <UserAuthForm/>

                            <p className="px-8 text-center text-sm text-muted-foreground">
                                By clicking continue, you agree to our{" "}
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