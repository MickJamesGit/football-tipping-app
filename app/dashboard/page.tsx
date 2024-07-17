import CardWrapper from "@/app/ui/dashboard/cards";
import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import {
  CardsSkeleton,
  LatestInvoicesSkeleton,
} from "@/app/ui/dashboard/skeletons";
import { Metadata } from "next";
import LatestTips from "../ui/dashboard/latest-tips";
import UpcomingGames from "../ui/dashboard/upcoming-games";
import { Game } from "../lib/definitions";
import { fetchUpcomingGames } from "../lib/data";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { requireAuth } from "../lib/auth-check";
export const metadata: Metadata = {
  title: "Dashboard",
};
export default async function Page() {
  const session = await auth();
  if (!session) redirect("/login");
  const games: Game[] = await fetchUpcomingGames("NRL");
  return (
    <main>
      <div className="w-full bg-gray-50 p-4 rounded-lg mb-6">
        {" "}
        {/* Added mb-6 for margin bottom */}
        <h1 className={`${lusitana.className} text-2xl text-left`}>
          Dashboard
        </h1>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestTips />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <UpcomingGames games={games} />
        </Suspense>
      </div>
    </main>
  );
}
