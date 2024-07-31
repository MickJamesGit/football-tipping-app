import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "@neondatabase/serverless";
import Facebook from "next-auth/providers/facebook";
import Instagram from "next-auth/providers/instagram";
import Twitter from "next-auth/providers/twitter";

declare module "next-auth" {
  interface User {
    username?: string | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  return {
    adapter: PostgresAdapter(pool),
    providers: [Google, Facebook, Instagram, Twitter],
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
