import SiteLogo from "../ui/site-logo";
import UsernameForm from "../ui/create-account/username-form";

export default function Page() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-green-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <SiteLogo />
          </div>
        </div>
        <UsernameForm />
      </div>
    </main>
  );
}
