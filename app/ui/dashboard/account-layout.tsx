import { Metadata } from "next";
import { fetchAccountDetails } from "@/app/lib/data";
import AccountComponent from "./account-component";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountLayout() {
  const user = await fetchAccountDetails();
  return <AccountComponent user={user} />;
}
