import { Metadata } from "next";
import AccountComponent from "@/components/dashboard/account/account-details";
import { getUserDetails } from "@/lib/user";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountDataFetcher() {
  const user = await getUserDetails();
  return <>{user && <AccountComponent user={user} />}</>;
}
