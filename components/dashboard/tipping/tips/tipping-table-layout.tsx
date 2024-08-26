import TippingTable from "./tipping-table";
import { getUserRegisteredCompetitions } from "@/lib/competitions";
import { getAllRoundsAndCurrent } from "@/lib/rounds";
import { getTipsBySportRound } from "@/lib/tips";
import { getGames } from "@/lib/games";

export default async function TippingTableLayout({
  sport,
  round,
}: {
  sport: string;
  round: string;
}) {
  const userCompetitions = await getUserRegisteredCompetitions();

  const [games, tips, sportsRounds] = await Promise.all([
    getGames(sport, round),
    getTipsBySportRound(sport, round),
    getAllRoundsAndCurrent(userCompetitions),
  ]);

  if (!games || games.length === 0) {
    return null;
  }

  return (
    <TippingTable
      games={games}
      tips={tips}
      sportsRounds={sportsRounds}
      sport={sport}
      round={round}
    />
  );
}
