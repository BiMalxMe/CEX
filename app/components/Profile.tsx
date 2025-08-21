"use client"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Profile(){
  const router = useRouter()
  const session = useSession()

  // Redirect if no user
  if (session.status === "unauthenticated") {
    router.push("/")
    return null
  }

  // Loading state
  if (session.status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="pt-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">

      
      <Greeting name={session?.data?.user?.name ?? ""} imageurl={session?.data?.user?.image ?? ""} />
      <Assets />
    </div>
    </div>
  )
}
function Greeting({ name, imageurl }: { name?: string; imageurl?: string }) {
  return (
    <div className="flex items-center">
     {imageurl ? (
        <Image
          src={imageurl}
          alt="User"
          width={48}
          height={48}
          className="rounded-full border object-cover w-16 h-16 "
        />
      ) : (
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Anonymous_emblem.svg/2048px-Anonymous_emblem.svg.png"
          alt="User"
          width={48}
          height={48}
          className="rounded-full border object-cover"
        />
      )}
      <div className="ml-4 text-2xl font-semibold">
        Hello, {name || "Guest"}!
      </div>
    </div>
  )
}

function Assets(){
  return (
    <div className="text-slate-400 mt-4">
      Account Assets
    </div>
  )
}