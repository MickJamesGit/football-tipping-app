import { LeaderboardEntry } from "@/types/definitions";
import LeaderboardTable from "./leaderboard-table";
import Pagination from "./pagination";
import { getLeaderboard, getLeaderboardPages } from "@/lib/rankings";
import { getPreviousRound } from "@/lib/rounds";
import { getActiveCompetitions } from "@/lib/competitions";

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
    getPreviousRound(sport),
    getActiveCompetitions(),
    getLeaderboardPages(sport),
  ]);

  const rankings: LeaderboardEntry[] = await getLeaderboard(
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
