import SideNav from "@/components/dashboard/sidenav";
export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 pb-16 md:overflow-y-auto md:p-12 md:pb-12 mt-10 md:mt-0">
        {" "}
        {children}
      </div>
    </div>
  );
}
