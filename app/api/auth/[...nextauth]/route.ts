import db from "@/app/db";
import { Keypair } from "@solana/web3.js";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

//for now we are using the signup and signnin with google only

const handler = NextAuth({
  
    providers: [
        GoogleProvider({
            //if not found its empty
          clientId: process.env.GOOGLE_CLIENT_ID ?? "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
      ],
      callbacks :{
        async signIn({ user, account, profile, email, credentials }) {

          if(account?.provider === "google") {
            const email = user.email;
            if(!email) {
              return false; 
            }
            const userdb =await db.user.findFirst({
              where: {
                username: email,
              },
            })
            if(userdb) {
              return true;
            }
            const keypair = Keypair.generate();
            const publicKey = keypair.publicKey.toBase58();
            const privateKey = keypair.secretKey;
            await db.user.create({
              data: {
                username : email,
                provider : "Google",
                name : profile?.name ?? "",
                // @ts-ignore
                profilePic : profile?.picture,
                solWallet : {
                  create :{
                    publicKey : publicKey,
                    privateKey : privateKey.toString(),
                  }
                },
                nprWallet : {
                  create : {
                    balance : 0,
                  }
                }
              }
            })
          }
          return false
        },
      }
      
})
console.log( "here it is" ,process.env.GOOGLE_CLIENT_ID ,process.env.GOOGLE_CLIENT_SECRET)
export {handler as POST, handler as GET}