import { Metadata } from "next";
import { Suspense } from "react";
import LeaderboardLayout from "@/components/dashboard/leaderboard/leaderboard-layout";
import { LeaderBoardTableSkeleton } from "@/components/skeletons";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Tipping leaderboard for each sport.",
  keywords: "leader, board, leaderboard, sport, ranking, tipping",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    sport?: string;
    page?: number;
    query?: string;
  };
}) {
  const query = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;
  const sport = searchParams?.sport || "AFL";

  return (
    <div className="w-full space-y-8">
      <Suspense fallback={<LeaderBoardTableSkeleton />}>
        <LeaderboardLayout sport={sport} query={query} page={page} />
      </Suspense>
    </div>
  );
}
