// /app/lib/data.ts
import { getActiveNoResultGames } from "@/app/lib/data";
import ScoresForm from "./../../../ui/dashboard/results-form";

export default async function Page() {
  const unresultedGames = await getActiveNoResultGames();

  return (
    <div className="w-full space-y-8">
      {unresultedGames && <ScoresForm unresultedGames={unresultedGames} />}
    </div>
  );
}
