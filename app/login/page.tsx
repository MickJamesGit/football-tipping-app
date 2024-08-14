import { Button } from "@/components/ui/button";
import Link from "next/link";
import SiteLogo from "../ui/site-logo";
import { facebookAuthenticate, googleAuthenticate } from "../lib/actions";
import { LoginForm } from "../ui/login/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account.",
  keywords: "login, account, sports, tipping, footy",
};

export default function Page() {
  return (
    <div className="lg:grid lg:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto w-[350px] space-y-6">
          <div className="space-y-2">
            <div className="block lg:hidden bg-primary py-8 rounded-lg pl-5">
              <SiteLogo />
            </div>
            <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
            <LoginForm />
            <div className="text-center text-sm">
              <Link
                href="/login/forgot-password"
                className="underline underline-offset-4"
                prefetch={false}
              >
                Forgot your password?
              </Link>
            </div>
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
