# NextAuth.js Authentication Example

This project demonstrates how to set up authentication in a Next.js app using [NextAuth.js](https://next-auth.js.org/).

## Features

- Google OAuth authentication
- API route for NextAuth at `/api/auth/[...nextauth]`
- Environment variables for secure credentials

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install next-auth
   ```

2. **Set up environment variables:**

   Create a `.env.local` file in your project root with the following:

   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Configure NextAuth:**

   The authentication handler is set up in `app/api/auth/[...nextauth]/route.ts`:

   ```ts
   import { authConfig } from "@/app/lib/auth";
   import NextAuth from "next-auth"

   const handler = NextAuth(authConfig)

   export { handler as GET, handler as POST }
   ```

4. **Run your app:**

   ```bash
   npm run dev
   ```

5. **Test authentication:**

   Visit `/api/auth/signin` to sign in with Google.

## Notes

- Make sure your Google OAuth credentials are set up in the [Google Cloud Console](https://console.cloud.google.com/).
- The `authConfig` should be defined in `app/lib/auth.ts` and include your Google provider configuration.

## Debugging

If you encounter issues, check your environment variables and review the console output for missing credentials.


