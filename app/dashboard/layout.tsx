import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SideNav from "@/components/dashboard/sidenav";
import { getUserDetails } from "@/lib/user";
import { DashboardProvider } from "../providers/dashboard-provider";
import { requireAuth } from "@/lib/auth/requireAdmin";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = await requireAuth();

  const user = await getUserDetails(authUser.id);

  return (
    <DashboardProvider user={user}>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>

        <div className="grow p-4 pb-16 md:overflow-y-auto md:p-6 mt-8">
          {children}
        </div>
      </div>
    </DashboardProvider>
  );
}
