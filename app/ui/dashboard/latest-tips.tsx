import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";
import { TipResult, fetchLatestTipResults } from "@/app/lib/data";
import { getUser } from "@/auth";

export default async function LatestTips() {
  const email = "user1@nextmail.com";
  const user = await getUser(email);
  const sport = "NRL";
  const tipResults: TipResult[] = await fetchLatestTipResults(user.id, sport);

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest Tips
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
                  <p className="text-sm text-gray-500 md:block">
                    {tip.tip_team_name === tip.away_team_name
                      ? tip.home_team_name
                      : tip.away_team_name}
                  </p>
                </div>
              </div>
              <div
                className={clsx("text-sm font-semibold", {
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
        <div className="flex items-center justify-between pt-6">
          <Link
            href="/dashboard/tipping"
            className="text-blue-600 font-semibold hover:underline"
          >
            Update your tips
          </Link>
        </div>
      </div>
    </div>
  );
}
