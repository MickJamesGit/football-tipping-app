import {
  fetchActiveSports,
  fetchLeaderboard,
  fetchLeaderboardPages,
  fetchPreviousRound,
} from "@/app/lib/data";

import { LeaderboardEntry } from "@/app/lib/definitions";
import LeaderboardTable from "./leaderboard-table";
import Pagination from "./pagination";

export default async function LeaderboardLayout({
  sport,
  query,
  page,
}: {
  sport: string;
  query: string;
  page: number;
}) {
  const [previousRound, sportsList, totalPages] = await Promise.all([
    fetchPreviousRound(sport),
    fetchActiveSports(),
    fetchLeaderboardPages(sport),
  ]);

  const rankings: LeaderboardEntry[] = await fetchLeaderboard(
    sport,
    "2024",
    previousRound,
    page,
    query
  );

  return (
    <>
      <LeaderboardTable
        sportsList={sportsList}
        query={query}
        rankings={rankings}
        sport={sport}
        previousRound={previousRound}
      />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
