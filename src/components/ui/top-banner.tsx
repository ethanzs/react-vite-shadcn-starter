import {Banner, type BannerProps} from "@/components/ui/banner"

export interface TopBannerProps extends BannerProps {
    isVisible?: boolean
}

// -/ Banners Example /-
// const banners = {
//     verification: {
//         variant: "primary" as const,
//         icon: <MailWarning className="h-5 w-5 drop-shadow-md"/>,
//         title: "Verify your email",
//         description: "Check your email for a verification link.",
//         action: (
//             <Button variant="outline" size="sm" className={"dark:text-white text-black"}
//                     onClick={() => ResendVerificationEmail()}>
//                 Resend
//             </Button>
//         ),
//     }
// }
//
//  !authContext?.data?.verified*/}
//      ? <TopBanner {...banners.verification}/>*/}
//      : null*/}
//

export function TopBanner({isVisible = true, ...props}: TopBannerProps) {
    if (!isVisible) return null

    return (
        <div className="relative inset-x-0 top-0 z-50">
            <Banner className="rounded-none border-x-0 border-t-0" dismissible={false} {...props} />
        </div>
    )
}

