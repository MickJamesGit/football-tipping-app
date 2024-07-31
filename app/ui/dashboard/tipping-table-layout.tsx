import {
  fetchAllRounds,
  fetchGames,
  fetchTips,
  fetchUserCompetitions,
} from "@/app/lib/data";
import TippingTable from "./tipping-table";

export default async function TippingTableLayout({
  sport,
  round,
}: {
  sport: string;
  round: string;
}) {
  const { userCompetitions } = await fetchUserCompetitions();
  const userSports = userCompetitions.signedUp.map(
    (competition) => competition.name
  );

  const [games, tips, sportsRounds] = await Promise.all([
    fetchGames(sport, round),
    fetchTips(sport, round),
    fetchAllRounds(userSports),
  ]);

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
