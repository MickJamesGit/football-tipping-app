import AccountLayout from "@/app/ui/dashboard/account-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

export default function Page() {
  return <AccountLayout />;
}
