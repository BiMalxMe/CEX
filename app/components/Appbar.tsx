"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import { PrimaryButton } from "./Button"

export const Appbar = () => {
    const { data: session } = useSession()

    return (
        <div className="w-full max-w-5xl mx-auto border-b px-4 py-3 flex justify-between items-center">
            <div className="text-xl sm:text-4xl font-bold flex items-baseline gap-1">
                EX
                <sub className="text-slate-400 text-xs sm:text-sm">partial</sub>
            </div>
            <div>
                {session?.user ? (
                    <PrimaryButton
                        className="px-4 py-2 text-sm sm:text-base"
                        onClick={() => signOut()}>
                        Logout
                    </PrimaryButton>
                ) : (
                    <PrimaryButton
                        className="px-4 py-2 text-sm sm:text-base"
                        onClick={() => signIn("google")}>
                        Sign In
                    </PrimaryButton>
                )}
            </div>
        </div>
    )
}
