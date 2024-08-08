import { Button } from "@/components/ui/button";

import Link from "next/link";
import SiteLogo from "../../ui/site-logo";
import { PasswordResetForm } from "@/app/ui/login/password-reset-form";

export default function Page() {
  return (
    <div className="lg:grid lg:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto w-[350px] space-y-6">
          <div className="space-y-2 text-center">
            <div className="block lg:hidden bg-primary py-8 rounded-lg pl-5">
              <SiteLogo />
            </div>
            <h1 className="text-3xl font-bold">Forgot Your Password?</h1>
            <p className="text-muted-foreground">
              Enter your email to reset your password
            </p>
          </div>
          <div className="space-y-4">
            <PasswordResetForm />

            <div className="text-center text-sm">
              <Link
                href="/login"
                className="underline underline-offset-4"
                prefetch={false}
              >
                Remembered your password? Log in
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
        </div>
      </div>
      <div className="hidden bg-background bg-primary lg:block">
        <Link
          href="#"
          className="flex items-center justify-center h-full"
          prefetch={false}
        >
          <SiteLogo />
        </Link>
      </div>
    </div>
  );
}
