import Table from "@/app/ui/games/table";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchGames, fetchTips } from "@/app/lib/data";
import { Metadata } from "next";
import { Games, Tips } from "@/app/lib/definitions";
import RoundSelector from "@/app/ui/games/roundselecter";
import { getUser } from "@/auth";

export const metadata: Metadata = {
  title: "Tipping",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    round?: string;
  };
}) {
  const sport = "NRL";
  const roundParam = searchParams?.round;
  const round = roundParam ? parseInt(roundParam) : 18; // Handle the case where roundParam is null
  const games: Games[] = await fetchGames(sport, round);
  const email = "user@nextmail.com";
  const user_id = await getUser(email);
  const tips: Tips[] = await fetchTips(user_id.id, round, sport);
  console.log(tips);

  return (
    <div className="w-full space-y-8">
      {" "}
      {/* Added space-y-8 for even spacing */}
      <div className="w-full bg-gray-50 p-4 rounded-lg">
        <h1 className={`${lusitana.className} text-2xl text-left`}>Games</h1>
      </div>
      <div className="flex w-full items-center justify-center">
        <RoundSelector currentRound={round} />
      </div>
      <Suspense key={round} fallback={<InvoicesTableSkeleton />}>
        <Table sport="NRL" round={round} games={games} tips={tips} />
      </Suspense>
    </div>
  );
}
