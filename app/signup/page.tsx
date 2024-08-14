import { Button } from "@/components/ui/button";
import Link from "next/link";
import SiteLogo from "../ui/site-logo";
import { facebookAuthenticate, googleAuthenticate } from "../lib/actions";
import { SignUpForm } from "../ui/signup/sign-up-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup",
  description: "Create an account to start tipping.",
  keywords: "create, account, tipping, sport, signup",
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
            <h1 className="text-3xl font-bold">Create Your Account</h1>
            <p className="text-muted-foreground">Sign up to get started</p>
          </div>
          <div className="space-y-4">
            <SignUpForm />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  OR
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <form action={facebookAuthenticate}>
                <Button
                  variant="outline"
                  className="w-full bg-[#1877F2] text-white flex items-center justify-center space-x-2 py-2"
                >
                  {/* Use an official Facebook SVG or image */}
                  <img
                    src="facebook-logo.png"
                    alt="Facebook"
                    className="h-5 w-5"
                  />
                  <span>Continue with Facebook</span>
                </Button>
              </form>
              <form action={googleAuthenticate}>
                <Button
                  variant="outline"
                  type="submit"
                  className="w-full bg-white border-gray-300 text-gray-900 flex items-center justify-center space-x-2 py-2"
                >
                  {/* Use an official Google SVG or image */}
                  <img src="google-logo.png" alt="Google" className="h-5 w-5" />
                  <span>Continue with Google</span>
                </Button>
              </form>
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

function ChromeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
