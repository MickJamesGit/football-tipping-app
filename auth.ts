import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";
import Google from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "@neondatabase/serverless";
import Facebook from "next-auth/providers/facebook";
import Instagram from "next-auth/providers/instagram";
import Twitter from "next-auth/providers/twitter";

export async function getUser(email: string): Promise<User> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  return {
    adapter: PostgresAdapter(pool),
    providers: [
      Google,
      Facebook,
      Instagram,
      Twitter,
      Credentials({
        async authorize(credentials) {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);
          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const user = await getUser(email);
            if (!user) return null;
            const passwordsMatch = await bcrypt.compare(
              password,
              user.password
            );

            if (passwordsMatch) return user;
          }

          console.log("Invalid credentials");
          return null;
        },
      }),
    ],
    session: {
      strategy: "database",
    },
    pages: {
      signIn: "/login",
    },
    callbacks: {
      async authorized({ auth, request: { nextUrl } }) {
        const isLoggedIn = !!auth?.user;
        console.log("isloggedin-auth");
        console.log(isLoggedIn);
        const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
        console.log("isdashboard-auth");
        console.log(isOnDashboard);
        if (isOnDashboard) {
          if (isLoggedIn) return true;
          return false; // Redirect unauthenticated users to login page
        } else if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      },
      async session({ session, user }) {
        session.user.id = user.id; // Assuming you want the user ID in the session
        return session;
      },
    },
  };
});
