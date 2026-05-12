import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "SportsTippers",
  description: "Create an account or log in to start tipping sports.",
  keywords: "create, account, tipping, sport, signup, tips, login, sports",
};

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/signup");
  }

  redirect("/dashboard");
}