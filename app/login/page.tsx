import SiteLogo from "@/app/ui/site-logo";
import LoginForm from "@/app/ui/login/login-form";
import { googleAuthenticate, facebookAuthenticate } from "../lib/actions";

export default function Page() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-green-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <SiteLogo />
          </div>
        </div>
        <form
          action={async () => {
            "use server";
            await googleAuthenticate();
          }}
        >
          <button
            type="submit"
            className="flex items-center justify-center w-full py-2 mt-4 text-black border border-black rounded-lg hover:bg-gray-100"
          >
            <img
              src="/google-logo.png"
              alt="Google Logo"
              className="w-6 h-6 mr-2"
            />
            Sign in with Google
          </button>
        </form>
        <form
          action={async () => {
            "use server";
            await facebookAuthenticate();
          }}
        >
          <button
            type="submit"
            className="flex items-center justify-center w-full py-2 mt-4 text-black border border-black rounded-lg hover:bg-gray-100"
          >
            <img
              src="/facebook-logo.png"
              alt="Facebook Logo"
              className="w-6 h-6 mr-2"
            />
            Sign in with Facebook
          </button>
        </form>
      </div>
    </main>
  );
}
