import { lusitana } from "@/app/ui/fonts";
import { Metadata } from "next";
import { Sport } from "@/app/lib/definitions";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import RankingsTable from "@/app/ui/leaderboard/rankingstable";
import { fetchLeaderboardPages, fetchPreviousRound } from "@/app/lib/data";
import SportSelector from "@/app/ui/games/sportselector";
import { getTodaysDate } from "@/app/lib/utils";
import Pagination from "@/app/ui/leaderboard/pagination";
import Search from "@/app/ui/search";

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
    query?: string;
  };
}) {
  const defaultSport: Sport = "NRL";
  const season = "2024";
  const query = searchParams?.query || "";
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
      <Search placeholder="Search by user alias..." />
      <Suspense
        key={season + sport + currentPage}
        fallback={<InvoicesTableSkeleton />}
      >
        <RankingsTable
          sport={sport}
          season={season}
          previousRound={previousRound}
          currentPage={currentPage}
          query={query}
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
