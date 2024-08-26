import RegistrationForm from "@/components/create-account/registration-form";
import { Metadata } from "next";
import { getActiveCompetitions } from "@/lib/competitions";
import AuthLayout from "@/components/auth-layout";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create an account to start tipping.",
  keywords: "create, account, tipping, sport, signup",
};

export default async function Page() {
  const activeCompetitions = await getActiveCompetitions();
  return (
    <AuthLayout>
      <RegistrationForm activeSports={activeCompetitions} />
    </AuthLayout>
  );
}
