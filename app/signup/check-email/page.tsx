import Link from "next/link";
import { Metadata } from "next";
import AuthLayout from "@/components/auth-layout";

export const metadata: Metadata = {
  title: "Check email",
  description: "Validate email upon account creation.",
  keywords: "validate, email, check, account, creation",
};

export default function Page() {
  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold text-center">Check Your Email</h1>
      <p className="text-muted-foreground text-center">
        We’ve sent you a verification link. Please check your email and click
        the link to verify your account.
      </p>
      <div className="text-center text-sm mt-6">
        <p>
          Already verified your account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Log in now
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
