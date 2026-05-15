import { auth } from "@/auth";
import { redirect } from "next/navigation";

const ADMIN_USER_ID = "56c47f5e-6481-48e9-99e0-d9f1434a98f1";

type AuthUser = {
  id: string;
  email: string;
  name: string;
  alias: string | null;
  image: string | null;
};

type AdminUser = {
  id: string;
};

export async function requireAuth(): Promise<AuthUser> {
  const session = await auth();

  if (
    !session?.user?.id ||
    !session.user.email ||
    !session.user.name
  ) {
    redirect("/login");
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    alias: session.user.username || null,
    image: session.user.image || null,
  };
}

export async function requireAdmin(): Promise<AdminUser>{
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.id !== ADMIN_USER_ID) {
    throw new Error("Unauthorized");
  }

  return { id: session.user.id };
}
