import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "@neondatabase/serverless";
import FacebookProvider from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail, getUserById } from "./app/lib/data";
import { LoginSchema } from "./app/lib/schemas";

declare module "next-auth" {
  interface User {
    username?: string | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  return {
    adapter: PostgresAdapter(pool),
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
            const passwordsMatch = await bcrypt.compare(
              password,
              user.password
            );
            if (passwordsMatch) return user;
          }
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
        const result = await pool.query(
          "SELECT alias FROM users WHERE id = $1",
          [user.id]
        );
        const dbUser = result.rows[0] || {};

        session.user = {
          ...session.user,
          id: user.id,
          name: user.name,
          image: user.image,
          username: dbUser.alias || "",
        };

        return session;
      },
    },
  };
});
