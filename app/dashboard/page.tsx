import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Profile from "../components/Profile"
import db from "@/app/db"
import { getServerSession } from "next-auth"
import { authConfig } from "../lib/auth"

async function getUserWallet(){
  const session =await getServerSession(authConfig);
  const userwallet = await db.solWallet.findFirst({
   where : {
    userId: session?.user?.uid ?? ""
   },
   select :{
    publicKey: true,
   }
  }
  );
  if(!userwallet){
    return {
      error : "Users solana wallet not found"
    }
  }
  return {error : null,userwallet};
}

export default async function(){
  const userwallet = await getUserWallet();
  if(!userwallet || userwallet.error){
   return (
    <div className="flex flex-col items-center justify-center h-screen">
      No user wallet found
    </div>
   )
  }
  return (  
    <div className="">
      
    <Profile publicKey={userwallet.userwallet?.publicKey}/>
    </div>
  )
}