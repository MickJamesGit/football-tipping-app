import NextAuth from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    alias?: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      alias?: string;
    } & DefaultSession["user"];
  }
}
