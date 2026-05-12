import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import SiteLogo from "@/components/site-logo";

export const metadata: Metadata = {
  title: "SportsTippers",
  description: "Create an account or log in to start tipping sports.",
  keywords: "create, account, tipping, sport, signup, tips, login, sports",
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-green-500 p-4 md:h-52">
        <SiteLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to SportsTippers!</strong> Show off your football
            expertise, challenge your mates, and claim your place as a champion.
          </p>
          <div className="flex space-x-4">
            <Link
              href="/signup"
              className="flex items-center justify-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
              <span>Sign up</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-5 self-start rounded-lg border border-blue-500 bg-white px-6 py-3 text-sm font-medium text-blue-500 transition-colors hover:bg-blue-50 md:text-base"
            >
              <span>Log in</span>
            </Link>
          </div>
        </div>
        <div className="relative flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <Image
            src="/hero-desktop.webp"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/hero-mobile.webp"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshots of the dashboard project showing mobile version"
          />
        </div>
      </div>
    </main>
  );
}
