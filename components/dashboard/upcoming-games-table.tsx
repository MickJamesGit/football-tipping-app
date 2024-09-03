"use client";

import Link from "next/link";
import { UpcomingGame, teamColors } from "@/types/definitions";
import { format } from "date-fns";
import { Button } from "../action-button";

type GamesListProps = {
  games: UpcomingGame[];
};

const UpcomingGamesTable: React.FC<GamesListProps> = ({ games }) => {
  const gamesByDate = games.reduce<Record<string, UpcomingGame[]>>(
    (acc, game) => {
      const gameDate = format(new Date(game.datetime), "EEEE, d MMMM yyyy");
      if (!acc[gameDate]) {
        acc[gameDate] = [];
      }
      acc[gameDate].push(game);
      return acc;
    },
    {}
  );

  return (
    <>
      <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl text-center">
        Upcoming Games
      </h2>
      {/* Outer div for whole table */}
      <div className="flex flex-col max-w-4xl mx-auto">
        {Object.entries(gamesByDate).map(([date, gamesOnDate]) => (
          <div key={date}>
            <h3 className="text-lg font-semibold mb-2">{date}</h3>
            {/* Game components */}
            <div className="grid gap-4 mb-3">
              {gamesOnDate.map((game) => {
                const homeTeamColors = teamColors[game.homeTeamName] || {
                  primary: "#ccc",
                  secondary: "#ccc",
                };
                const awayTeamColors = teamColors[game.awayTeamName] || {
                  primary: "#ccc",
                  secondary: "#ccc",
                };

                const formattedTime = format(new Date(game.datetime), "h:mm a");

                return (
                  <div key={game.id} className="rounded-lg border p-4">
                    {/* Team names and colours */}
                    <div className="flex justify-between items-center mb-4 ">
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
                          <span>{game.homeTeamName.split(" ").slice(-1)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-semibold">
                          <span>{game.awayTeamName.split(" ").slice(-1)}</span>
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
                    {/* Team rankings, venue, time */}
                    <div className="flex justify-around items-center mb-4">
                      <div className="text-center">
                        <div className="text-xs md:text-sm">
                          {game.homeTeamRanking && (
                            <span className="font-medium text-2xl">
                              {game.homeTeamRanking}
                              <span className="text-xs align-top">
                                {getOrdinalSuffix(game.homeTeamRanking)}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-xs md:text-sm">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <div className="flex items-center gap-2 flex-wrap max-w-full">
                            <StadiumIcon className="w-5 h-5" />
                            <span className="break-words max-w-full">
                              {game.venue}
                            </span>{" "}
                            {/* Wrapped text */}
                          </div>
                          <div className="flex items-center gap-2">
                            <ClockIcon className="w-5 h-5 " />
                            <span className="font-medium">{formattedTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-xs md:text-sm">
                          {/* Replace with your team ranking content */}
                          {game.awayTeamRanking && (
                            <span className="font-medium text-2xl ordinal">
                              {game.awayTeamRanking}
                              <span className="text-xs align-top">
                                {getOrdinalSuffix(game.awayTeamRanking)}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* User tip and button link */}
                    <div className="flex justify-between flex-row">
                      <div className="text-sm font-medium md:text-md mt-4">
                        {game.tippedTeam
                          ? `You've Tipped: ${game.tippedTeam.split(" ").pop()}`
                          : "No Tip Saved"}
                      </div>
                      <Link
                        href={`/dashboard/tipping/tips?sport=${game.sport}&round=${game.round}`}
                        className="self-center"
                      >
                        <Button>
                          {" "}
                          {game.tippedTeam ? "Update Tip" : "Submit Tip"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UpcomingGamesTable;

function getOrdinalSuffix(number: number) {
  const tens = number % 100;
  if (tens >= 11 && tens <= 13) {
    return "th";
  }
  switch (number % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Circle for the clock face */}
      <circle cx="12" cy="12" r="10" />
      {/* Hour hand */}
      <path d="M12 6v6" />
      {/* Minute hand */}
      <path d="M12 12l4 2" />
    </svg>
  );
}

function StadiumIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Stadium base */}
      <path d="M4 18h16a1 1 0 0 1 1 1v2H3v-2a1 1 0 0 1 1-1z" />

      {/* Top curved section */}
      <path d="M2 10c0-4 20-4 20 0v2H2v-2z" />

      {/* Middle section */}
      <path d="M4 12h16v6H4v-6z" />

      {/* Spectator lines */}
      <path d="M8 12v-2M12 12v-2M16 12v-2" />

      {/* Entrance */}
      <rect x="10" y="18" width="4" height="4" rx="1" />
    </svg>
  );
}
