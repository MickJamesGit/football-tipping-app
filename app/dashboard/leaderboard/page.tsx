import { lusitana } from "@/app/ui/fonts";
import { Metadata } from "next";
import { NRLRankings } from "@/app/lib/definitions";
import RoundSelector from "@/app/ui/leaderboard/roundselector";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import RankingsTable from "@/app/ui/leaderboard/rankingstable";
import { fetchLeaderboard } from "@/app/lib/data";
import { parse } from "path";

export const metadata: Metadata = {
  title: "Leaderboard",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    round?: string;
    sport?: string;
  };
}) {
  const sport = "NRL";
  const roundParam = searchParams?.round;
  const round = "18"; // Handle the case where roundParam is null
  const rankings: NRLRankings[] = await fetchLeaderboard(sport, round);
  console.log(rankings);

  return (
    <div className="w-full space-y-8">
      {" "}
      {/* Added space-y-8 for even spacing */}
      <div className="w-full bg-gray-50 p-4 rounded-lg">
        <h1 className={`${lusitana.className} text-2xl text-left`}>
          Leaderboard
        </h1>
      </div>
      <div className="flex w-full items-center justify-center">
        <RoundSelector currentRound={round} />
      </div>
      <Suspense key={round} fallback={<InvoicesTableSkeleton />}>
        <RankingsTable rankings={rankings} />
      </Suspense>
    </div>
  );
}
