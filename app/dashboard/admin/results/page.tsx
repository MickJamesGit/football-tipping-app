// /app/lib/data.ts

import { getActiveNoResultGames } from "@/lib/games";
import ScoresForm from "../../../../components/dashboard/admin/results/results-form";

export default async function Page() {
  const unresultedGames = await getActiveNoResultGames();

  return (
    <div className="w-full space-y-8">
      {unresultedGames && <ScoresForm unresultedGames={unresultedGames} />}
    </div>
  );
}
