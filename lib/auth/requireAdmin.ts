import { auth } from "@/auth";
import { redirect } from "next/navigation";

const ADMIN_USER_ID = "56c47f5e-6481-48e9-99e0-d9f1434a98f1";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.id !== ADMIN_USER_ID) {
    throw new Error("Unauthorized");
  }

  return session;
}