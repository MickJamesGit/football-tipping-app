import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { getUserAlias } from "./app/lib/data";

export async function middleware(request: NextRequest) {
  const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  console.log("Is on Dashboard:", isOnDashboard);

  if (isOnDashboard) {
    const session = await auth();
    if (!session) {
      // If no session, redirect to login page
      console.log("User not logged in, redirecting to login page");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (session?.user?.id) {
      const userId = session.user.id;
      console.log("User ID:", userId);

      try {
        const userAlias = await getUserAlias(userId);
        const userHasAlias = !!userAlias;

        console.log("User Alias:", userAlias);
        console.log("User Has Alias:", userHasAlias);

        if (!userHasAlias) {
          // Redirect authenticated users without alias to the create account page
          console.log("Redirecting to create account page");
          return NextResponse.redirect(new URL("/create-account", request.url));
        }

        // If the user has an alias, allow the request to proceed
        return NextResponse.next();
      } catch (error) {
        console.error("Error fetching user alias:", error);
        throw error;
      }
    }
  }

  // Allow all other requests to proceed
  console.log("Allowing access to non-dashboard page");
  return NextResponse.next();
}
