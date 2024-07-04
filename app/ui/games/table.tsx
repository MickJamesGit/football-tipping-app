"use client";

import React, { useState } from "react";
import { fetchGames } from "@/app/lib/data";
import { Games } from "@/app/lib/definitions";

type SelectedTeams = {
  [Team: string]: string;
};

export default function GamesTable({
  sport,
  round,
  games,
}: {
  sport: string;
  round: number;
  games: Games[];
}) {
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeams>({});

  const handleTeamClick = (gameId: string, team_name: string) => {
    setSelectedTeams((prevSelectedTeams) => ({
      ...prevSelectedTeams,
      [gameId]: team_name,
    }));
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-3">
          <form>
            <div>
              {games?.map((game) => {
                const date = new Date(game.date).toDateString();
                const time = new Date(`1970-01-01T${game.time}Z`);
                // Manually adjust the time to UTC+10
                time.setHours(time.getUTCHours() + 10);
                const formattedTime = time.toISOString().substr(11, 5); // HH:MM format

                return (
                  <div
                    key={game.id}
                    className="mb-4 w-full rounded-md bg-white p-4 text-center"
                  >
                    <div className="mb-2">
                      <p className="text-xl font-medium">
                        {date} | {formattedTime} AEST
                      </p>
                      <p className="text-sm text-gray-500">{game.venue}</p>
                    </div>
                    <div className="flex justify-center items-center space-x-4">
                      <div
                        className={`flex-1 p-2 cursor-pointer rounded-lg border ${
                          selectedTeams[game.id] === game.home_team_name
                            ? "bg-blue-500 text-white"
                            : ""
                        }`}
                        onClick={() =>
                          handleTeamClick(game.id, game.home_team_name)
                        }
                      >
                        <p>{game.home_team_name}</p>
                      </div>
                      <div className="p-2">vs</div>
                      <div
                        className={`flex-1 p-2 cursor-pointer rounded-lg border ${
                          selectedTeams[game.id] === game.away_team_name
                            ? "bg-blue-500 text-white"
                            : ""
                        }`}
                        onClick={() =>
                          handleTeamClick(game.id, game.away_team_name)
                        }
                      >
                        <p>{game.away_team_name}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-right">
              <button
                type="submit"
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
              >
                Submit Tips
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
