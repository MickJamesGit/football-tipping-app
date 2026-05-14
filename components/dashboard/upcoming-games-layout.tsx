import { getGames } from "@/lib/games/games";
import UpcomingGamesTable from "./upcoming-games-table";
import { getTipsByGames } from "@/lib/tips";

export async function UpcomingGamesLayout({ sports }: { sports: string[] }) {
  const games = await getGames({
    sport: sports,
    status: "SCHEDULED",
  });

  if (!games.length) return null;

  const gamesList = games.map((game) => game.id);
  const gamesTips = await getTipsByGames(gamesList);

  const tipsMap = new Map(
    gamesTips.map((tip) => [tip.gameId, tip.teamName])
  );

  const upcomingGames = games.map((game) => ({
    ...game,
    tippedTeam: tipsMap.get(game.id) || null,
  }));

  return <UpcomingGamesTable games={upcomingGames} />;
}