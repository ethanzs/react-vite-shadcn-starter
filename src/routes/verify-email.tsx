import React from "react";
import {useVerificationBackupEmailMutation} from "@/lib/mutations.ts";
import {useNavigate, useSearchParams} from "react-router-dom";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const verificationCode = searchParams.get("verification-code")

    const {mutate: verifyBackupEmail} = useVerificationBackupEmailMutation()

    React.useEffect(() => {
        if (verificationCode) {
            verifyBackupEmail(verificationCode);
        } else {
            navigate("/")
        }
    }, [navigate, verificationCode, verifyBackupEmail]);

    return <div/>
}
