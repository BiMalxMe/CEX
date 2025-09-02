"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import { PrimaryButton } from "./Button"


export const Appbar = () => {
    const session = useSession()
    return  (
        <div className="border-b p-2 flex justify-between lg:w-2/4 lg:mx-auto">
                <div className="text-2xl font-bold flex flex-col justify-center">
                    CEX
                </div>
                <div>
                    {session.data?.user? <PrimaryButton 
                    onClick={
                        () => signOut()
                    }>
                        Logout
                        </PrimaryButton> :  <PrimaryButton 
                    onClick={
                        () => signIn("google")
                    }>
                        SignIn
                        </PrimaryButton>
                        }
                </div>
        </div>
    )
}