import Link from "next/link";
import { SignUpForm } from "@/components/signup/sign-up-form";
import { Metadata } from "next";
import AuthLayout from "@/components/auth-layout";
import FacebookLoginButton from "@/components/facebook-login-button";
import GoogleLoginButton from "@/components/google-login-button";

export const metadata: Metadata = {
  title: "Signup",
  description: "Create an account to start tipping.",
  keywords: "create, account, tipping, sport, signup",
};

export default function Page() {
  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create Your Account</h1>
        <p className="text-muted-foreground">Sign up to get started</p>
      </div>
      <div className="space-y-4">
        <SignUpForm />
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
      </div>
      <div className="text-center text-sm mt-6">
        <p>
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
