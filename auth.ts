import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { LoginSchema } from "./lib/schemas";
import { randomUUID } from "crypto";
import { encode } from "next-auth/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserByEmail } from "./lib/user";
import prisma from "./prisma";
import { createSession } from "./lib/auth";

declare module "next-auth" {
  interface User {
    username?: string | null;
  }
}

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "database",
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
    async encode(arg) {
      return (arg.token?.sessionId as string) ?? encode(arg);
    },
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    async session({ session, user }) {
      const result = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          alias: true,
        },
      });

      session.user = {
        ...session.user,
        id: user.id,
        name: user.name,
        image: user.image,
        username: result?.alias ?? "",
      };

      return session;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
  
        const expires = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000);
        const sessionToken = randomUUID();

        if (!user || !user.id) {
          console.error("User or User ID is not defined");
          return null;
        }

        const session = await createSession(user.id, sessionToken, expires);
        token.sessionId = session?.sessionToken;
      }

      return token;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
