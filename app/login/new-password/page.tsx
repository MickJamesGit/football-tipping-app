import Link from "next/link";
import SiteLogo from "../../ui/site-logo";
import { NewPasswordForm } from "@/app/ui/login/new-password-form";

export default function Page() {
  return (
    <div className="lg:grid lg:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto w-[350px] space-y-6">
          <div className="space-y-2 text-center">
            <div className="block lg:hidden bg-primary py-8 rounded-lg pl-5">
              <SiteLogo />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <NewPasswordForm />
            </div>
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
