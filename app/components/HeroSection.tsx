"use client"
import { signIn, useSession } from "next-auth/react"
import { SecondaryButton } from "./Button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export const Hero = () => {
    const session = useSession()
    const router = useRouter()

    return (
        <div className="flex flex-col items-center">
            <div className="text-5xl font-semibold flex items-center">
                <span>
                    The Nepalese Cryptocurrency
                </span>
                <span className="text-blue-500 ml-3">
                    Revolution
                </span>
            </div>
            <div className="pt-4 text-2xl text-slate-600 text-center">
                Create a frictionless wallet from Nepal with just Google Account.
            </div>
            <div className="pt-2 text-2xl text-slate-600 text-center">
                Convert your NPR into Cryptocurrency
            </div>
           { session?.data?.user? <div className="pt-5 flex justify-center">
                <SecondaryButton onClick={() => router.push("/dashboard") }>Go to Dashboard</SecondaryButton>
            </div> :
            <div className="pt-5 flex justify-center">
            <SecondaryButton onClick={() => signIn("google")}>Login With Google </SecondaryButton>
        </div>
}
        </div>
    )
}