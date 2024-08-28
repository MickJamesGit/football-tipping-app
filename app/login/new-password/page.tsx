import { Metadata } from "next";
import { NewPasswordForm } from "@/components/login/new-password/new-password-form";
import AuthLayout from "@/components/auth-layout";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "New Password",
  description: "Enter a new password for your account.",
  keywords: "new, password, account",
};

export default function Page() {
  return (
    <AuthLayout>
      <div className="space-y-4">
        <div className="space-y-2 text-center">
          <Suspense>
            <NewPasswordForm />
          </Suspense>{" "}
          <div className="mt-2">
            <Link
              href="/login"
              className="underline underline-offset-4"
              prefetch={false}
            >
              Return to log in page
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
