import { Metadata } from "next";
import { VerificationForm } from "../ui/signup/verification-form";
export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify account email.",
  keywords: "verify, account, email",
};

export default function Page() {
  return <VerificationForm />;
}
