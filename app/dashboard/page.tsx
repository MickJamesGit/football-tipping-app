import { lusitana } from "@/app/ui/fonts";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dashboard",
};
export default async function Page() {
  return (
    <main>
      <div className="w-full bg-gray-50 p-4 rounded-lg mb-6">
        {" "}
        {/* Added mb-6 for margin bottom */}
        <h1 className={`${lusitana.className} text-2xl text-left`}>
          Dashboard
        </h1>
      </div>
    </main>
  );
}
