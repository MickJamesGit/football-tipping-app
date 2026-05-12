import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SideNav from "@/components/dashboard/sidenav";
import { getUserDetails } from "@/lib/user";
import { DashboardProvider } from "../providers/dashboard-provider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await getUserDetails(session.user.id);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <DashboardProvider user={user}>
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>

        <div className="flex-grow p-4 pb-16 md:overflow-y-auto md:p-6 mt-8">
          {children}
        </div>
      </DashboardProvider>
    </div>
  );
}
