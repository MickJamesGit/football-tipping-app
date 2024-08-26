import { getUpcomingGames } from "@/lib/games";
import UpcomingGamesTable from "./upcoming-games-table";
import { getTipsByGames } from "@/lib/tips";
import { UpcomingGame } from "@/types/definitions";

export async function UpcomingGamesLayout({ sports }: { sports: string[] }) {
  const games = await getUpcomingGames(sports);

  let upcomingGames: UpcomingGame[] = [];

  if (games && games.length > 0) {
    const gamesList = games.map((game) => game.id);
    const gamesTips = await getTipsByGames(gamesList);

    const tipsMap = new Map(gamesTips.map((tip) => [tip.gameId, tip.teamName]));

    upcomingGames = games.map((game) => ({
      ...game,
      tippedTeam: tipsMap.get(game.id) || null,
    }));
  }

  return upcomingGames.length > 0 ? (
    <UpcomingGamesTable games={upcomingGames} />
  ) : null;
}
