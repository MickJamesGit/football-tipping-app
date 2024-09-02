import Link from "next/link";
import { PowerIcon } from "@heroicons/react/24/outline";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { AppBar, Toolbar } from "@mui/material";
import { getUserDetails } from "@/lib/user";
import SiteLogo from "../site-logo";
import NavLinks from "./nav-links";
import UserAccountSheet from "./account/user-account-sheet";

export default async function SideNav() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }
  const user = await getUserDetails();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 overflow-visible">
      <div className="block md:hidden">
        <AppBar
          position="fixed"
          className="z-50"
          style={{ backgroundColor: "hsl(var(--primary))" }}
        >
          <Toolbar className="flex justify-between items-center">
            <div className="w-32 text-white flex items-center">
              <SiteLogo />
            </div>
            <div className="flex items-center mt-2">
              <UserAccountSheet user={user} />
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <Link
        className="hidden md:flex mb-2 h-20 items-end justify-start rounded-md bg-primary p-4 md:h-38"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <SiteLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <div className="hidden md:block">
          <NavLinks />
        </div>
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <div className="hidden md:block">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-primary hover:text-white md:flex-none md:justify-start md:p-2 md:px-3">
              <PowerIcon className="w-6" />
              <div className="hidden md:block">Sign Out</div>
            </button>
          </form>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md z-50">
        <NavLinks />
      </div>
    </div>
  );
}

const UserAccountIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: "pointer" }} // Correctly typed style object
    >
      <circle
        cx="16"
        cy="16"
        r="15"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="16"
        cy="12"
        r="4"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M8 25C8 20.5 12 18 16 18C20 18 24 20.5 24 25"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
};
