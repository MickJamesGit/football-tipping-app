import Link from "next/link";
import { Metadata } from "next";
import { PasswordResetForm } from "@/components/login/forgot-password/password-reset-form";
import AuthLayout from "@/components/auth-layout";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request password reset.",
  keywords: "forgot, password, reset, login",
};

export default function Page() {
  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold text-center">Forgot Your Password?</h1>
      <p className="text-muted-foreground text-center">
        Enter your email to reset your password
      </p>
      <div className="space-y-4">
        <PasswordResetForm />

        <div className="text-center text-sm">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4"
            prefetch={false}
          >
            Log in
          </Link>
        </div>
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
