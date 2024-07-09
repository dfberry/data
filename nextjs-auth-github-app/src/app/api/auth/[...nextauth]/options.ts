import GitHubProvider from "next-auth/providers/github";
import type { AuthOptions, DefaultUser, DefaultSession } from "next-auth";
import NextAuth from "next-auth";

// DB for session
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const options: AuthOptions = {
  pages: {
    signIn: "/sign-out",
    signOut: "/sign-out"
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      name: "GitHub",
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    })
  ],
  callbacks: {
    jwt({ token, trigger, session, account }) {

      console.log("Token-token:", JSON.stringify(token, null, 2))
      console.log("Token-session:", JSON.stringify(session, null, 2))
      console.log("Token-account:", JSON.stringify(account, null, 2))

      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        console.log("Provider used:", account.provider);
        console.log(JSON.stringify(account.provider, null, 2))
        token.socialauth = account.provider
      }
      return token
    },
    async session({ session, token, user }) {

      console.log("Session-Session:", JSON.stringify(session, null, 2))
      console.log("Session-Token:", JSON.stringify(token, null, 2))
      console.log("Session-user:", JSON.stringify(user, null, 2))

      if (token?.accessToken) {
        session.accessToken = token.accessToken || ''
      }
      if (token?.provider) {
        // https://next-auth.js.org/configuration/callbacks#session-callback
        // The session object is not persisted server side, even when 
        // using database sessions - only data such as the session 
        // token, the user, and the expiry time is stored in the 
        // session table.

        // @ts-ignore - token type is not defined
        session.socialauth = token?.provider?.name || '';
        console.log(JSON.stringify(token.provider, null, 2))
      }
      return session
    },

  },
};


declare module "next-auth/jwt" {
  interface JWT {
    id: string
    accessToken?: string
    socialauth?: string
  }
}
declare module 'next-auth' {

  interface Session {
    user?: DefaultUser & { id: string; role: string };
    accessToken?: string
    id: string
    socialauth?: any
    role?: 'admin' | 'user'
  }

  interface User extends DefaultUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: 'admin' | 'user'
  }
}

//export const { handlers, signIn, signOut, auth } = NextAuth(options);
