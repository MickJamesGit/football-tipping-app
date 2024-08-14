"use client";

import { Button } from "./button";
import Link from "next/link";
import { Game, teamColors } from "@/app/lib/definitions";
import { format } from "date-fns";

type GamesListProps = {
  games: Game[];
};

const UpcomingGamesTable: React.FC<GamesListProps> = ({ games }) => {
  return (
    <div className="grid gap-4 mx-auto max-w-screen-lg">
      <h2 className="mb-4 text-xl md:text-2xl text-center">Upcoming Games</h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {games.map((game) => {
          const homeTeamColors = teamColors[game.home_team_name] || {
            primary: "#ccc",
            secondary: "#ccc",
          };
          const awayTeamColors = teamColors[game.away_team_name] || {
            primary: "#ccc",
            secondary: "#ccc",
          };

          const formattedDate = format(
            new Date(game.datetime),
            "EEEE, d MMMM" // Use a consistent format string
          );
          const formattedTime = format(
            new Date(game.datetime),
            "h:mm a" // Use a consistent format string
          );

          return (
            <div
              key={game.id}
              className="bg-background rounded-lg border p-4 flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${homeTeamColors.primary} 50%, ${homeTeamColors.secondary} 50%)`,
                    }}
                  >
                    <div className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="text-lg font-semibold">
                    <span>{game.home_team_name.split(" ").slice(-1)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-semibold">
                    <span>{game.away_team_name.split(" ").slice(-1)}</span>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${awayTeamColors.primary} 50%, ${awayTeamColors.secondary} 50%)`,
                    }}
                  >
                    <div className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="text-center mb-4">
                <div className="text-sm text-muted-foreground">
                  <div>{game.venue}</div>
                  <div>{formattedDate}</div>
                  <div>{formattedTime}</div>
                </div>
              </div>
              <Link
                href={`/dashboard/tipping/tips?sport=${game.sport}&round=${game.round}`}
                className="self-center"
              >
                <Button>Submit Tip</Button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingGamesTable;
