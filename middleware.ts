import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { getUserAliasByUserId } from "./lib/user";

export const config = {
  runtime: "nodejs",
};

export async function middleware(request: NextRequest) {
  const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isOnLogin = request.nextUrl.pathname.startsWith("/login");

  if (isOnDashboard) {
    const session = await auth();
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (session?.user?.id) {
      const userId = session.user.id;

      try {
        const userAlias = await getUserAliasByUserId(userId);
        const userHasAlias = !!userAlias;

        if (!userHasAlias) {
          return NextResponse.redirect(new URL("/create-account", request.url));
        }
        return NextResponse.next();
      } catch (error) {
        console.error("Error fetching user alias:", error);
        throw error;
      }
    }
  }

  if (isOnLogin) {
    const session = await auth();
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}
