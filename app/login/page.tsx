import Link from "next/link";
import { LoginForm } from "@/components/login/login-form";
import { Metadata } from "next";
import FacebookLoginButton from "@/components/facebook-login-button";
import GoogleLoginButton from "@/components/google-login-button";
import AuthLayout from "@/components/auth-layout";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account.",
  keywords: "login, account, sports, tipping, footy",
};

export default function Page() {
  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
      <Suspense>
        <LoginForm />
      </Suspense>
      <div className="text-center text-sm">
        <Link
          href="/login/forgot-password"
          className="underline underline-offset-4"
          prefetch={false}
        >
          Forgot your password?
        </Link>
      </div>
      <div className="relative z-10">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <FacebookLoginButton />
        <GoogleLoginButton />
      </div>
      <div className="text-center text-sm mt-6">
        <p>
          Don't have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4">
            Sign up now
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
