// components/GamesTable.js
import { fetchGames } from "@/app/lib/data";
import Table from "@/app/ui/games/table";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";

const GamesTable = async ({ sport, round }) => {
  const games = await fetchGames(sport, round);
  return (
    <div className="mt-6">
      <Table sport={sport} round={round} games={games} />
    </div>
  );
};

export default GamesTable;
