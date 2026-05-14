// /app/lib/data.ts

import { getActiveNoResultGames, getGames } from "@/lib/games/games";
import ScoresForm from "../../../../components/dashboard/admin/results/results-form";

export default async function Page() {
  const unresultedGames = await getGames({
      sport: ["AFL", "NRL"],
      status: "COMPLETE",
    });
  

  return (
    <div className="w-full space-y-8">
      {unresultedGames && <ScoresForm unresultedGames={unresultedGames} />}
    </div>
  );
}
