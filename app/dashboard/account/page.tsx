import AccountDetails from "@/components/dashboard/account/account-details";
import { AccountLayoutSkeleton } from "@/components/skeletons";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Account",
  description: "Your account and settings.",
  keywords: "account, settings, preferences",
};

export default function Page() {
  return (
    <div className="w-full space-y-8">
      <Suspense fallback={<AccountLayoutSkeleton />}>
        <AccountDetails />
      </Suspense>
    </div>
  );
}
