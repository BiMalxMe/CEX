import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Profile from "../components/Profile"
import db from "@/app/db"
import { getServerSession } from "next-auth"

function getBalance(){
  const session = getServerSession();
  db.user.findFirst({
   
  }
  );
  return 0;
}

export default async function(){

  return (
    <div className="">
    <Profile />
    </div>
  )
}