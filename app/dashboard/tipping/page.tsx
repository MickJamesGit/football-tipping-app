import Table from "@/app/ui/dashboard/tipping/table";
import { Suspense } from "react";
import {
  fetchAllRounds,
  fetchCurrentRound,
  fetchGames,
  fetchTips,
} from "@/app/lib/data";
import { Metadata } from "next";
import { Game, Sport, Tips } from "@/app/lib/definitions";
import SportSelector from "@/app/ui/dashboard/tipping/sportselector";
import { GamesTableSkeleton } from "@/app/ui/dashboard/skeletons";
import { getTodaysDate, isValidRound } from "@/app/lib/utils";
import PageHeading from "@/app/ui/dashboard/page-heading";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import RoundPagination from "@/app/ui/dashboard/tipping/roundpagination";

export const metadata: Metadata = {
  title: "Tipping",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    round?: string;
    sport?: Sport;
  };
}) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }

  const sportParam = searchParams?.sport;
  const sport: Sport =
    sportParam === "NRL" || sportParam === "AFL" ? sportParam : "NRL";

  const roundParam = searchParams?.round;
  const todays_date = getTodaysDate();

  let filteredRound: string = "";

  if (isValidRound(roundParam)) {
    filteredRound = roundParam!;
  } else {
    const currentRound = await fetchCurrentRound(todays_date, sport);
    filteredRound = currentRound;
  }

  const games: Game[] = await fetchGames(sport, filteredRound);
  const tips: Tips[] = await fetchTips(session.user.id, filteredRound, sport);
  const allRounds: number[] = await fetchAllRounds("2024", sport);

  return (
    <div className="w-full space-y-8">
      <PageHeading title="Tipping" />
      <div className="flex w-full space-y-3 items-center justify-center flex-col">
        <SportSelector currentSport={sport} />
        <RoundPagination
          allRounds={allRounds}
          initialRound={parseInt(filteredRound)}
        />
      </div>
      <Suspense key={filteredRound} fallback={<GamesTableSkeleton />}>
        <Table games={games} tips={tips} userId={session.user.id} />
      </Suspense>
    </div>
  );
}
