"use client";
import React, { useState, useEffect, useRef } from "react";
import { Games, Tips } from "@/app/lib/definitions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen, faTimes } from "@fortawesome/free-solid-svg-icons";
import { updateTips } from "@/app/lib/actions";
import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type SelectedTeams = {
  [game: string]: string;
};

export type States = {
  error?: boolean;
  message?: string | null;
};

export default function GamesTable({
  sport,
  round,
  games,
  tips,
  userId,
}: {
  sport: string;
  round: number;
  games: Games[];
  tips: Tips[];
  userId: string;
}) {
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeams>({});
  const [unselectedGames, setUnselectedGames] = useState<string[]>([]);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const initialState: States = { message: "", error: false };
  const [state, formAction] = useActionState(updateTips, initialState);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Initialize selectedTeams based on existing tips
    const initialSelectedTeams: SelectedTeams = {};
    tips.forEach((tip) => {
      initialSelectedTeams[tip.game_id] = tip.tip_team_id;
    });
    setSelectedTeams(initialSelectedTeams);
  }, [tips]);

  useEffect(() => {
    if (state.message) {
      setOpen(true);
    }
  }, [state]);

  const handleTeamClick = (
    gameId: string,
    team_id: string,
    gameStatus: string
  ) => {
    if (gameStatus === "inprogress" || gameStatus === "completed") return;

    setSelectedTeams((prevSelectedTeams) => ({
      ...prevSelectedTeams,
      [gameId]: team_id,
    }));

    setUnselectedGames((prevUnselectedGames) =>
      prevUnselectedGames.filter((id) => id !== gameId)
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getTipStatusIcon = (status: string | undefined) => {
    switch (status) {
      case "correct":
        return faCheck;
      case "incorrect":
        return faTimes;
      default:
        return faPen;
    }
  };

  const getTipStatusStyles = (status: string | undefined) => {
    switch (status) {
      case "correct":
        return "bg-green-200 text-black";
      case "incorrect":
        return "bg-red-200 text-black";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const getTipIconStyles = (status: string | undefined) => {
    switch (status) {
      case "correct":
        return "bg-green-500 text-white";
      case "incorrect":
        return "bg-red-500 text-white";
      case "pending":
        return "";
      default:
        return "";
    }
  };

  const getStatusMessage = (status: string | undefined) => {
    switch (status) {
      case "inprogress":
        return "IN PROGRESS";
      case "upcoming":
        return "UPCOMING";
      case "completed":
        return "COMPLETED";
      default:
        return "";
    }
  };

  return (
    <div className="mt-6 flow-root">
      <div ref={messageRef} className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-3">
          <form action={formAction}>
            <div>
              {games?.map((game) => {
                const dateTime = new Date(game.datetime);

                // Format the date to a readable format
                const date = dateTime.toDateString();

                // Format the time to HH:MM format
                const hours = dateTime.getHours().toString().padStart(2, "0");
                const minutes = dateTime
                  .getMinutes()
                  .toString()
                  .padStart(2, "0");
                const formattedTime = `${hours}:${minutes}`;

                const isUnselected = unselectedGames.includes(game.id);
                const isDisabled =
                  game.status === "inprogress" || game.status === "completed";

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
                      <p className="text-sm text-gray-500">
                        {getStatusMessage(game.status)}
                      </p>
                    </div>
                    <div className="flex justify-center items-center space-x-4">
                      <div
                        className={`flex-1 p-2 cursor-pointer rounded-lg border flex items-center justify-between ${
                          selectedTeams[game.id] === game.home_team_id
                            ? getTipStatusStyles(
                                tips.find(
                                  (tip) =>
                                    tip.game_id === game.id &&
                                    tip.tip_team_id === game.home_team_id
                                )?.status
                              )
                            : isDisabled &&
                                selectedTeams[game.id] !== game.home_team_id
                              ? "bg-gray-200 opacity-50 pointer-events-none"
                              : ""
                        }`}
                        onClick={() =>
                          handleTeamClick(
                            game.id,
                            game.home_team_id,
                            game.status
                          )
                        }
                      >
                        <p>{game.home_team_name}</p>
                        {selectedTeams[game.id] === game.home_team_id && (
                          <span
                            className={`ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full ${getTipIconStyles(
                              tips.find(
                                (tip) =>
                                  tip.game_id === game.id &&
                                  tip.tip_team_id === game.home_team_id
                              )?.status
                            )}`}
                          >
                            <div className="w-6 h-6 flex items-center justify-center">
                              <FontAwesomeIcon
                                icon={getTipStatusIcon(
                                  tips.find(
                                    (tip) =>
                                      tip.game_id === game.id &&
                                      tip.tip_team_id === game.home_team_id
                                  )?.status
                                )}
                                style={{ fontSize: "0.75rem" }}
                              />
                            </div>
                          </span>
                        )}
                      </div>
                      <div className="p-2">vs</div>
                      <div
                        className={`flex-1 p-2 cursor-pointer rounded-lg border flex items-center justify-between ${
                          selectedTeams[game.id] === game.away_team_id
                            ? getTipStatusStyles(
                                tips.find(
                                  (tip) =>
                                    tip.game_id === game.id &&
                                    tip.tip_team_id === game.away_team_id
                                )?.status
                              )
                            : isDisabled &&
                                selectedTeams[game.id] !== game.away_team_id
                              ? "bg-gray-200 opacity-50 pointer-events-none"
                              : ""
                        }`}
                        onClick={() =>
                          handleTeamClick(
                            game.id,
                            game.away_team_id,
                            game.status
                          )
                        }
                      >
                        <p>{game.away_team_name}</p>
                        {selectedTeams[game.id] === game.away_team_id && (
                          <span
                            className={`ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full ${getTipIconStyles(
                              tips.find(
                                (tip) =>
                                  tip.game_id === game.id &&
                                  tip.tip_team_id === game.away_team_id
                              )?.status
                            )}`}
                          >
                            <div className="w-6 h-6 flex items-center justify-center">
                              <FontAwesomeIcon
                                icon={getTipStatusIcon(
                                  tips.find(
                                    (tip) =>
                                      tip.game_id === game.id &&
                                      tip.tip_team_id === game.away_team_id
                                  )?.status
                                )}
                                style={{ fontSize: "0.75rem" }}
                              />
                            </div>
                          </span>
                        )}
                      </div>
                    </div>
                    <input
                      type="hidden"
                      name={`selectedTeam[${game.id}]`}
                      value={selectedTeams[game.id] || ""}
                    />
                    <input type="hidden" name="loggedInUser" value={userId} />
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
              >
                Save Tips
              </Button>
            </div>
            <Snackbar
              open={open}
              autoHideDuration={3000}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                onClose={handleClose}
                severity={state.error ? "error" : "success"}
              >
                {state.message}
              </Alert>
            </Snackbar>
          </form>
        </div>
      </div>
    </div>
  );
}
