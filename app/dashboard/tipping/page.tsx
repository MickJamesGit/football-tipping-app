import Table from "@/app/ui/games/table";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchCurrentRound, fetchGames, fetchTips } from "@/app/lib/data";
import { Metadata } from "next";
import { Games, Sport, Tips } from "@/app/lib/definitions";
import RoundSelector from "@/app/ui/games/roundselecter";
import SportSelector from "@/app/ui/games/sportselector";
import { getUser } from "@/auth";

export const metadata: Metadata = {
  title: "Tipping",
};

function isValidRound(round: string | undefined): boolean {
  // Check if the round is a valid integer and within the expected range
  if (round && !isNaN(Number(round))) {
    const roundNumber = Number(round);
    // Assuming valid rounds are between 1 and 30 for example purposes
    return roundNumber >= 1 && roundNumber <= 30;
  }
  return false;
}

function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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
  const todays_date = getTodayDate();

  let filteredRound: string = "";

  if (isValidRound(roundParam)) {
    filteredRound = roundParam!;
  } else {
    // Call fetchCurrentRound if roundParam is not valid
    const currentRound = await fetchCurrentRound(todays_date, sport);
    filteredRound = currentRound;
  }

  const games: Games[] = await fetchGames(sport, filteredRound);
  const email = "user@nextmail.com";
  const user = await getUser(email);
  const tips: Tips[] = await fetchTips(user.id, filteredRound, sport); // Ensure this matches the expected parameters

  console.log(tips);

  return (
    <div className="w-full space-y-8">
      <div className="w-full bg-gray-50 p-4 rounded-lg">
        <h1 className={`${lusitana.className} text-2xl text-left`}>Tipping</h1>
      </div>
      <div className="flex w-full items-center justify-center flex-col">
        <SportSelector currentSport={sport} />
        <RoundSelector currentRound={parseInt(filteredRound)} />
      </div>
      <Suspense key={filteredRound} fallback={<InvoicesTableSkeleton />}>
        <Table
          sport={sport}
          round={parseInt(filteredRound)}
          games={games}
          tips={tips}
        />
      </Suspense>
    </div>
  );
}
