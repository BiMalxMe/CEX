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
      ]
      
})
console.log( "here it is" ,process.env.GOOGLE_CLIENT_ID ,process.env.GOOGLE_CLIENT_SECRET)
export {handler as POST, handler as GET}