import { Metadata } from "next";
import { Suspense } from "react";
import { LeaderBoardTableSkeleton } from "@/app/ui/dashboard/skeletons";
import LeaderboardLayout from "@/app/ui/dashboard/leaderboard-layout";

export const metadata: Metadata = {
  title: "Leaderboard",
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
