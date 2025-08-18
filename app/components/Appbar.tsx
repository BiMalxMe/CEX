import { useSession } from "next-auth/react"


export const Appbar = () => {
    const session = useSession()
    return  (
        <div className="border-b p-2 flex justify-between ">
                <div>
                    CEX
                </div>
                <div>
                    {session.data?.user?.name}
                </div>
        </div>
    )
}