import clsx from "clsx";
import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";
import { TipResult, fetchLatestTipResults } from "@/app/lib/data";
import { auth } from "@/auth";

export default async function LatestTips() {
  const session = await auth();

  if (!session?.user?.id) return null;
  const sport = "NRL";
  const tipResults: TipResult[] = await fetchLatestTipResults(
    session.user.id,
    sport
  );

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest Tip Results
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4 shadow-md">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {tipResults.map((tip, i) => (
            <div
              key={tip.game_id}
              className={clsx(
                "flex flex-row items-center justify-between py-4",
                {
                  "border-t border-gray-200": i !== 0,
                }
              )}
            >
              <div className="flex items-center">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold md:text-base">
                    {tip.tip_team_name}
                  </p>
                  Over
                  <p className="text-sm text-gray-500 md:block">
                    {tip.tip_team_name === tip.away_team_name
                      ? tip.home_team_name
                      : tip.away_team_name}
                  </p>
                </div>
              </div>
              <div
                className={clsx("text-sm font-semibold capitalize", {
                  "text-green-500": tip.status === "correct",
                  "text-red-500": tip.status === "incorrect",
                  "text-blue-500": tip.status === "pending",
                })}
              >
                {tip.status}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Link
            href="/dashboard/leaderboard"
            className="text-blue-600 font-semibold hover:underline"
          >
            View leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}
