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
import {
  fetchPreviousRound,
  fetchRoundTotalUsers,
  fetchUpcomingGames,
  fetchUserRankingSummary,
  fetchUserdetails,
} from "../lib/data";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Avatar } from "@mui/material";
import { getTodaysDate } from "../lib/utils";
export const metadata: Metadata = {
  title: "Dashboard",
};
export default async function Page() {
  const games: Game[] = await fetchUpcomingGames("NRL");
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }

  const sport = "NRL";
  const todays_date = getTodaysDate();
  const lastRound = await fetchPreviousRound(todays_date, sport);

  const [
    { alias, image },
    overallRankingSummary,
    roundRankingSummary,
    roundTotalUsers,
    overallTotalUsers,
  ] = await Promise.all([
    fetchUserdetails(session.user.id),
    fetchUserRankingSummary(sport, "2024", session.user.id, "overall"),
    fetchUserRankingSummary(sport, "2024", session.user.id, lastRound),
    fetchRoundTotalUsers(sport, lastRound),
    fetchRoundTotalUsers(sport, "overall"),
  ]);

  return (
    <main>
      <div className="w-full bg-gray-50 p-4 rounded-lg mb-6 flex items-center">
        <Avatar src={image} alt={alias} />

        <h1
          className={`${lusitana.className} text-2xl text-left ml-4 font-bold`}
        >
          {alias}
        </h1>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper
            overallRankingSummary={overallRankingSummary}
            roundRankingSummary={roundRankingSummary}
            roundTotalUsers={roundTotalUsers}
            overallTotalUsers={overallTotalUsers}
            lastRound={lastRound}
          />
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
