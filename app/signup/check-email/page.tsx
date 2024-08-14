import Link from "next/link";
import SiteLogo from "../../ui/site-logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check email",
  description: "Validate email upon account creation.",
  keywords: "validate, email, check, account, creation",
};

export default function Page() {
  return (
    <div className="lg:grid lg:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto w-[350px] space-y-6">
          <div className="space-y-2 text-center">
            <div className="block lg:hidden bg-primary py-8 rounded-lg pl-5">
              <SiteLogo />
            </div>
            <h1 className="text-3xl font-bold">Check Your Email</h1>
            <p className="text-muted-foreground">
              We’ve sent you a verification link. Please check your email and
              click the link to verify your account.
            </p>
          </div>

          <div className="text-center text-sm mt-6">
            <p>
              Already verified your account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Log in now
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
