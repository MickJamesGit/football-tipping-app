import Table from "@/app/ui/games/table";
import { Suspense } from "react";
import { fetchCurrentRound, fetchGames, fetchTips } from "@/app/lib/data";
import { Metadata } from "next";
import { Games, Sport, Tips } from "@/app/lib/definitions";
import RoundSelector from "@/app/ui/games/roundselecter";
import SportSelector from "@/app/ui/games/sportselector";
import { getUser } from "@/auth";
import { GamesTableSkeleton } from "@/app/ui/skeletons";
import { getTodaysDate, isValidRound } from "@/app/lib/utils";
import PageHeading from "@/app/ui/dashboard/page-heading";

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
  const defaultSport: Sport = "NRL";

  const sportParam = searchParams?.sport;
  const sport: Sport =
    sportParam === "NRL" || sportParam === "AFL" ? sportParam : defaultSport;

  const roundParam = searchParams?.round;
  const todays_date = getTodaysDate();

  let filteredRound: string = "";

  if (isValidRound(roundParam)) {
    filteredRound = roundParam!;
  } else {
    const currentRound = await fetchCurrentRound(todays_date, sport);
    filteredRound = currentRound;
  }

  const games: Games[] = await fetchGames(sport, filteredRound);
  const email = "user@nextmail.com";
  const user = await getUser(email);
  const tips: Tips[] = await fetchTips(user.id, filteredRound, sport);

  return (
    <div className="w-full space-y-8">
      <PageHeading title="Tipping" />
      <div className="flex w-full items-center justify-center flex-col">
        <SportSelector currentSport={sport} />
        <RoundSelector currentRound={parseInt(filteredRound)} />
      </div>
      <Suspense key={filteredRound} fallback={<GamesTableSkeleton />}>
        <Table
          sport={sport}
          round={parseInt(filteredRound)}
          games={games}
          tips={tips}
          userId={user.id}
        />
      </Suspense>
    </div>
  );
}
