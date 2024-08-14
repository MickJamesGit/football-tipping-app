import Link from "next/link";
import SiteLogo from "../ui/site-logo";

import { fetchActiveSports } from "../lib/data";
import RegistrationForm from "../ui/create-account/registration-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create an account to start tipping.",
  keywords: "create, account, tipping, sport, signup",
};

export default async function Page() {
  const sports = await fetchActiveSports();
  return (
    <div className="lg:grid lg:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto w-[350px] space-y-6">
          <div className="space-y-2">
            <div className="block lg:hidden bg-primary py-8 rounded-lg pl-5">
              <SiteLogo />
            </div>
            <RegistrationForm sports={sports} />
          </div>
        </div>
      </div>
      <div className="hidden bg-background bg-primary lg:block">
        <Link
          href="/"
          className="flex items-center justify-center h-full"
          prefetch={false}
        >
          <SiteLogo />
        </Link>
      </div>
    </div>
  );
}
