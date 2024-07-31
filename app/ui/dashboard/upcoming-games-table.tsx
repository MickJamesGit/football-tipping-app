"use client";

import { Button } from "./button";
import Link from "next/link";
import { Game, teamColors } from "@/app/lib/definitions";

type GamesListProps = {
  games: Game[];
};

const UpcomingGamesTable: React.FC<GamesListProps> = ({ games }) => {
  return (
    <div className="grid gap-4 justify-items-center mx-auto max-w-screen-lg">
      <h2 className="mb-4 text-xl md:text-2xl">Upcoming Games</h2>
      {games.map((game, i) => {
        const homeTeamColors = teamColors[game.home_team_name] || {
          primary: "#ccc",
          secondary: "#ccc",
        };
        const awayTeamColors = teamColors[game.away_team_name] || {
          primary: "#ccc",
          secondary: "#ccc",
        };
        const dateOptions: Intl.DateTimeFormatOptions = {
          weekday: "long",
          day: "numeric",
          month: "long",
        };
        const timeOptions: Intl.DateTimeFormatOptions = {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };

        const formattedDate = new Date(game.datetime).toLocaleDateString(
          "en-AU",
          dateOptions
        );
        const formattedTime = new Date(game.datetime).toLocaleTimeString(
          "en-AU",
          timeOptions
        );

        return (
          <div key={game.id} className="flex flex-col py-1 relative w-full">
            <div className="bg-background rounded-lg border p-4 flex flex-col md:flex-row items-center md:items-stretch justify-between relative">
              <div className="flex items-center gap-2 md:gap-4 absolute top-4 left-4 md:static md:px-4">
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

              <div className="flex flex-col items-center gap-1 mt-16 md:mt-0 md:mx-auto md:my-auto">
                <div className="text-sm text-muted-foreground text-center">
                  <div>{game.venue}</div>
                  <div>{formattedDate}</div>
                  <div>{formattedTime}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-4 absolute top-4 right-4 md:static md:px-4 md:self-center">
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

              <Link
                href={`/dashboard/tipping/tips?sport=${game.sport}&round=${game.round}`}
                className="mt-4 md:mt-0 self-end md:self-center md:px-4"
              >
                <Button>Submit Tip</Button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UpcomingGamesTable;
