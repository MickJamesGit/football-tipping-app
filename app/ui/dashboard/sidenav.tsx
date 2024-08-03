import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import { PowerIcon } from "@heroicons/react/24/outline";
import { auth, signOut } from "@/auth";
import SiteLogo from "@/app/ui/site-logo";
import { redirect } from "next/navigation";
import { AppBar, IconButton, Toolbar } from "@mui/material";
import { fetchUserdetails } from "@/app/lib/data";
import AvatarDrawer from "../avatardrawer";

export default async function SideNav() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }
  const { alias, name, image } = await fetchUserdetails(session.user.id);

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 overflow-visible">
      <div className="block md:hidden">
        <AppBar position="fixed" className="bg-primary z-50">
          <Toolbar className="flex justify-between">
            <div className="w-32 text-white">
              <SiteLogo />
            </div>
            <IconButton aria-label="user menu" color="primary">
              <AvatarDrawer alias={alias} name={name} image={image} />
            </IconButton>
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
