"use client";

import React, { useState, useEffect, useRef } from "react";
import { Games, Tips } from "@/app/lib/definitions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

type SelectedTeams = {
  [Team: string]: string;
};

export default function GamesTable({
  sport,
  round,
  games,
  tips,
}: {
  sport: string;
  round: number;
  games: Games[];
  tips: Tips[];
}) {
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeams>({});
  const [unselectedGames, setUnselectedGames] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize selectedTeams based on existing tips
    const initialSelectedTeams: SelectedTeams = {};
    tips.forEach((tip) => {
      initialSelectedTeams[tip.game_id] = tip.tip_team_id;
    });
    setSelectedTeams(initialSelectedTeams);
  }, [tips]);

  useEffect(() => {
    // Scroll to the top when the message is updated
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  const handleTeamClick = (gameId: string, team_id: string) => {
    setSelectedTeams((prevSelectedTeams) => ({
      ...prevSelectedTeams,
      [gameId]: team_id,
    }));

    setUnselectedGames((prevUnselectedGames) =>
      prevUnselectedGames.filter((id) => id !== gameId)
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const unselected = games
      .filter((game) => !selectedTeams[game.id])
      .map((game) => game.id);

    if (unselected.length > 0) {
      setUnselectedGames(unselected);
      setMessage(`Please select a team for every game before submitting.`);
      return;
    }

    // Handle form submission
    console.log("Selected Teams:", selectedTeams);
    setMessage("Tips saved. Good luck!");
    setUnselectedGames([]);
    // Add your form submission logic here
  };

  return (
    <div className="mt-6 flow-root">
      <div ref={messageRef} className="inline-block min-w-full align-middle">
        {message && (
          <div
            className={`mb-4 text-center p-2 rounded ${message.includes("Tips saved") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {message}
          </div>
        )}
        <div className="rounded-lg bg-gray-50 p-2 md:pt-3">
          <form onSubmit={handleSubmit}>
            <div>
              {games?.map((game, index) => {
                const date = new Date(game.date).toDateString();
                const time = new Date(`1970-01-01T${game.time}Z`);
                // Manually adjust the time to UTC+10
                time.setHours(time.getUTCHours() + 10);
                const formattedTime = time.toISOString().substr(11, 5); // HH:MM format

                const isUnselected = unselectedGames.includes(game.id);

                return (
                  <div
                    key={game.id}
                    className={`mb-4 w-full rounded-md p-4 text-center ${
                      isUnselected ? "border-4 border-red-500" : "bg-white"
                    }`}
                  >
                    <div className="mb-2">
                      <p className="text-xl font-medium">
                        {date} | {formattedTime} AEST
                      </p>
                      <p className="text-sm text-gray-500">{game.venue}</p>
                    </div>
                    <div className="flex justify-center items-center space-x-4">
                      <div
                        className={`flex-1 p-2 cursor-pointer rounded-lg border flex items-center justify-between ${
                          selectedTeams[game.id] === game.home_team_id
                            ? "bg-blue-500 text-white"
                            : ""
                        }`}
                        onClick={() =>
                          handleTeamClick(game.id, game.home_team_id)
                        }
                      >
                        <p>{game.home_team_name}</p>
                        {selectedTeams[game.id] === game.home_team_id && (
                          <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-white border border-black rounded-full">
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="text-black"
                            />
                          </span>
                        )}
                      </div>
                      <div className="p-2">vs</div>
                      <div
                        className={`flex-1 p-2 cursor-pointer rounded-lg border flex items-center justify-between ${
                          selectedTeams[game.id] === game.away_team_id
                            ? "bg-blue-500 text-white"
                            : ""
                        }`}
                        onClick={() =>
                          handleTeamClick(game.id, game.away_team_id)
                        }
                      >
                        <p>{game.away_team_name}</p>
                        {selectedTeams[game.id] === game.away_team_id && (
                          <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-white border border-black rounded-full">
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="text-black"
                            />
                          </span>
                        )}
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
