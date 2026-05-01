import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import React from "react";
import {useMfaTotpMutation, useMfaTotpValidateMutation} from "@/lib/mutations.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Banner} from "@/components/ui/banner.tsx";
import {Check} from "lucide-react";

export interface AddAuthenticatorProps extends React.HTMLAttributes<HTMLDivElement> {
    onSave?: () => void;
    onCancel?: () => void;
}

export default function AddAuthenticator(props: AddAuthenticatorProps) {
    const [code, setCode] = React.useState<string>("")

    const mutationSetup = useMfaTotpMutation()
    const mutationValidate = useMfaTotpValidateMutation()
    const setupTotp = mutationSetup.mutate

    React.useEffect(() => {
        setupTotp("Device1")
    }, [setupTotp])

    function handleSave() {
        mutationValidate.mutate(code)
    }

    return <div className={"flex flex-col gap-2"}>
        <div>
            <h1 className={"text-sm font-bold"}>Scan the QR code</h1>
            <p className={"text-xs text-muted-foreground"}>Use an authenticator app or browser extension to scan.</p>
        </div>


        <div className={"py-4"}>
            {
                mutationSetup.isSuccess && mutationSetup.data
                    ? <img
                        className={"max-w-60 rounded bg-white p-4"}
                        src={mutationSetup.data} alt={"qr-code"}/>
                    : <Skeleton className={"size-[200px] p-4"}/>
            }

        </div>

        <div/>

        <div className={"flex flex-col gap-2"}>
            <Label htmlFor={"code"} className={"font-bold"}>Verify the code from the
                app</Label>
            <Input disabled={mutationValidate.isPending || mutationValidate.isSuccess} value={code}
                   onChange={(e) => setCode(e.target.value)} id={"code"}
                   className={"w-full max-w-sm"}
                   placeholder={"XXXXXX"}/>
            <div className={"flex flex-row gap-2"}>
                <Button onClick={handleSave}
                        disabled={mutationValidate.isPending || mutationValidate.isSuccess}>Save</Button>
                <Button variant={"outline"}
                        onClick={props.onCancel} disabled={mutationValidate.isPending}>Cancel</Button>
            </div>

            {
                mutationValidate.isSuccess && <Banner title={"Success"}
                                                      variant={"success"}
                                                      description={"Authenticator was added to your account for two-factor authentication."}
                                                      icon={<Check/>}/>
            }
        </div>
    </div>
}
