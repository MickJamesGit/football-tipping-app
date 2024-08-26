import { Metadata } from "next";
import { VerificationForm } from "@/components/verify-email/verification-form";
import AuthLayout from "@/components/auth-layout";
export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify account email.",
  keywords: "verify, account, email",
};

export default function Page() {
  return (
    <AuthLayout>
      <VerificationForm />
    </AuthLayout>
  );
}
