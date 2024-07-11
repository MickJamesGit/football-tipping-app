import { lusitana } from "@/app/ui/fonts";
import { Metadata } from "next";
import { LeaderboardEntry, NRLRankings, Sport } from "@/app/lib/definitions";
import RoundSelector from "@/app/ui/leaderboard/roundselector";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import RankingsTable from "@/app/ui/leaderboard/rankingstable";
import {
  fetchCurrentRound,
  fetchLeaderboard,
  fetchLeaderboardPages,
  fetchPreviousRound,
} from "@/app/lib/data";
import SportSelector from "@/app/ui/games/sportselector";
import { getTodaysDate } from "@/app/lib/utils";
import Pagination from "@/app/ui/invoices/pagination";

export const metadata: Metadata = {
  title: "Leaderboard",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    round?: string;
    sport?: string;
    page?: number;
  };
}) {
  const defaultSport: Sport = "NRL";
  const season = "2024";

  const currentPage = Number(searchParams?.page) || 1;

  const sportParam = searchParams?.sport;
  const sport: Sport =
    sportParam === "NRL" || sportParam === "AFL" ? sportParam : defaultSport;

  const todays_date = getTodaysDate();
  const previousRound = await fetchPreviousRound(todays_date, sport);

  const totalPages = await fetchLeaderboardPages(sport);

  return (
    <div className="w-full space-y-8">
      {" "}
      {/* Added space-y-8 for even spacing */}
      <div className="w-full bg-gray-50 p-4 rounded-lg">
        <h1 className={`${lusitana.className} text-2xl text-left`}>
          Leaderboard
        </h1>
      </div>
      <div className="flex w-full items-center justify-center flex-col">
        <SportSelector currentSport={sport} />
      </div>
      <Suspense
        key={season + sport + currentPage}
        fallback={<InvoicesTableSkeleton />}
      >
        <RankingsTable
          sport={sport}
          season={season}
          previousRound={previousRound}
          currentPage={currentPage}
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
