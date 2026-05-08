
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnLogin = req.nextUrl.pathname.startsWith("/login");
  const isOnCreateAccount = req.nextUrl.pathname.startsWith("/create-account");

  // Not logged in → block dashboard
  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Logged in → block login page
  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Always allow other routes through middleware
  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/create-account"],
};