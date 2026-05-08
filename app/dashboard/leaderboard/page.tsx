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
  searchParams?: Promise<{
    sport?: string;
    page?: string;
    query?: string;
  }>;
}) {
  const params = await searchParams;

  const query = params?.query || "";
  const page = Number(params?.page) || 1;
  const sport = params?.sport || "AFL";
  
  return (
    <div className="w-full space-y-8">
      <Suspense fallback={<LeaderBoardTableSkeleton />}>
        <LeaderboardLayout sport={sport} query={query} page={page} />
      </Suspense>
    </div>
  );
}
