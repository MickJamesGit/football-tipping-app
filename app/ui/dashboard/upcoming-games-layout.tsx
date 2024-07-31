import { fetchUpcomingGames } from "@/app/lib/data";
import { Game } from "@/app/lib/definitions";
import UpcomingGamesTable from "./upcoming-games-table";

export async function UpcomingGamesLayout({ sports }: { sports: string[] }) {
  const games: Game[] = await fetchUpcomingGames(sports);

  return <UpcomingGamesTable games={games} />;
}
