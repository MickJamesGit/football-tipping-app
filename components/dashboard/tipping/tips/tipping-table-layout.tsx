import TippingTable from "./tipping-table";
import { getUserRegisteredCompetitions } from "@/lib/competitions";
import { getAllRoundsAndCurrent } from "@/lib/rounds";
import { getTipsBySportRound } from "@/lib/tips";
import { getGames } from "@/lib/games/games";
import PageHeading from "../../page-heading";

export default async function TippingTableLayout({
  sport,
  round,
}: {
  sport: string;
  round: string;
}) {
  const userCompetitions = await getUserRegisteredCompetitions();

  const [games, tips, sportsRounds] = await Promise.all([
    getGames({
    sport: [sport],
    round: round,
  }),
    getTipsBySportRound(sport, round),
    getAllRoundsAndCurrent(userCompetitions),
  ]);

  if (games.length === 0) {
    return <p>No games found</p>;
  }

  return (
    <>
      <div className="container mx-auto py-4 pb-4 mb-6 bg-slate-50 rounded-lg px-1 md:px-6">
        <PageHeading
          title={`${sport} Tipping`}
          description={`Review your tips for Round ${round} of the 2026 ${sport} season.`}
        />
        <TippingTable
          games={games}
          tips={tips}
          sportsRounds={sportsRounds}
          sport={sport}
          round={round}
        />
      </div>
    </>
  );
}
