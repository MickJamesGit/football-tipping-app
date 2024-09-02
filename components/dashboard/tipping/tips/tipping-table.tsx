"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/dropdown-menu";
import { Button } from "@/components/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/table";
import React, { useState, useEffect, useRef } from "react";
import { updateTips } from "@/lib/tips";
import { GameWithTeamNames, teamColors, Tips } from "@/types/definitions";
import { useToast } from "@/components/use-toast";
import { useFormState } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SelectedTeams = {
  [game: string]: string;
};

export type States = {
  error?: boolean;
  message?: string | null;
};

export default function TippingTable({
  games,
  tips,
  sportsRounds,
  sport,
  round,
}: {
  games: GameWithTeamNames[];
  tips: Tips[];
  sportsRounds: {
    sport: string;
    rounds: string[];
    currentRound: string | null;
  }[];
  sport: string;
  round: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRound, setSelectedRound] = useState(round);
  const [selectedSport, setSelectedSport] = useState(sport);
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeams>({});
  const [unselectedGames, setUnselectedGames] = useState<string[]>([]);
  const initialState: States = { message: "", error: false };
  const [state, formAction] = useFormState(updateTips, initialState);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const { toast } = useToast();
  const currentSportRounds = sportsRounds.find(
    (sportRound) => sportRound.sport === sport
  );

  useEffect(() => {
    // Check if all games are either 'completed' or 'inprogress'
    const allGamesCompletedOrInProgress = games.every(
      (game) => game.status === "COMPLETE" || game.status === "INPROGRESS"
    );
    setShowSaveButton(!allGamesCompletedOrInProgress);
  }, [games, tips]);

  useEffect(() => {
    // Initialize selectedTeams based on existing tips
    const initialSelectedTeams: SelectedTeams = {};
    tips.forEach((tip) => {
      initialSelectedTeams[tip.gameId] = tip.teamId;
    });
    setSelectedTeams(initialSelectedTeams);
  }, [tips, games]);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.error ? "Error" : "Success",
        duration: 3000,
        description: state.message,
        variant: state.error ? "destructive" : null,
        className: state.error ? "" : "bg-green-500 text-white border-none",
        style: { zIndex: 500 },
      });
    }
  }, [state, toast]);

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

  const renderTeamName = (teamName: string) => {
    return teamName.split(" ").map((word, index) => (
      <div key={index} className="block">
        {word}
      </div>
    ));
  };

  const currentRoundIndex = currentSportRounds
    ? currentSportRounds.rounds.indexOf(selectedRound)
    : -1;

  const goToPreviousRound = () => {
    if (currentSportRounds && currentRoundIndex > 0) {
      const newRound = currentSportRounds.rounds[currentRoundIndex - 1];
      handleRoundChange(newRound);
    }
  };

  // Function to go to the next round
  const goToNextRound = () => {
    if (
      currentSportRounds &&
      currentRoundIndex < currentSportRounds.rounds.length - 1
    ) {
      const newRound = currentSportRounds.rounds[currentRoundIndex + 1];
      handleRoundChange(newRound);
    }
  };

  const handleRoundChange = (newRound: string) => {
    setSelectedRound(newRound);
    const params = new URLSearchParams(searchParams.toString());
    params.set("round", newRound);
    router.push(`?${params.toString()}`, undefined);
  };

  const handleSportChange = (newSport: string) => {
    setSelectedSport(newSport);

    // Find the current round for the new sport
    const currentRoundForSport =
      sportsRounds.find((sr) => sr.sport === newSport)?.currentRound || "1";
    setSelectedRound(currentRoundForSport);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sport", newSport);
    params.set("round", currentRoundForSport);
    router.push(`?${params.toString()}`, undefined);
  };

  return (
    <div className="border rounded-lg overflow-hidden relative">
      <div className="bg-primary text-primary-foreground px-2 py-2 flex justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="text-sm font-medium border bg-primary  text-primary-foreground/80 focus:outline-none"
            >
              {selectedSport} <ChevronDownIcon className="h-6 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Select Sport</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sportsRounds.map((sportRound) => (
              <DropdownMenuItem
                key={sportRound.sport}
                onClick={() => handleSportChange(sportRound.sport)}
              >
                {sportRound.sport}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center overflow-hidden gap-1">
          {/* Conditionally render the left button if not at the first round */}
          {currentSportRounds && currentRoundIndex > 0 && (
            <Button
              variant="outline"
              size="icon"
              className="text-sm font-medium bg-primary text-primary-foreground/80"
              onClick={goToPreviousRound}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Dropdown for Round Selection */}
          {currentSportRounds && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-sm font-medium border bg-primary text-primary-foreground/80 focus:outline-none"
                >
                  Round {selectedRound} <ChevronDownIcon className="h-6 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Select Round</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sportsRounds
                  .find((sportRound) => sportRound.sport === selectedSport)
                  ?.rounds.map((round) => (
                    <DropdownMenuItem
                      key={round}
                      onClick={() => handleRoundChange(round)}
                    >
                      Round {round}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Conditionally render the right button if not at the last round */}
          {currentSportRounds &&
            currentRoundIndex < currentSportRounds.rounds.length - 1 && (
              <Button
                variant="outline"
                size="icon"
                className="text-sm font-medium bg-primary text-primary-foreground/80 "
                onClick={goToNextRound}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
        </div>
      </div>
      <form action={formAction}>
        <div className="">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%] text-left text-xs lg:text-base">
                  Home Team
                </TableHead>
                <TableHead className="w-[20%] text-center text-xs lg:text-base">
                  Details
                </TableHead>
                <TableHead className="w-[40%] text-right text-xs lg:text-base">
                  Away Team
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games?.map((game) => {
                const homeTeamColors = teamColors[game.homeTeamName] || {
                  primary: "#ccc",
                  secondary: "#ccc",
                };
                const awayTeamColors = teamColors[game.awayTeamName] || {
                  primary: "#ccc",
                  secondary: "#ccc",
                };
                const dateTime = new Date(game.datetime);
                const currentTime = new Date();

                // Calculate if the game is live
                const timeDifferenceInHours =
                  (currentTime.getTime() - dateTime.getTime()) /
                  (1000 * 60 * 60);
                const isLive =
                  timeDifferenceInHours >= 0 && timeDifferenceInHours <= 2;

                const date = new Intl.DateTimeFormat("en-au", {
                  month: "short",
                  day: "numeric",
                }).format(dateTime);
                const hours = dateTime.getHours().toString().padStart(2, "0");
                const minutes = dateTime
                  .getMinutes()
                  .toString()
                  .padStart(2, "0");
                const formattedTime = `${hours}:${minutes}`;

                const isUnselected = unselectedGames.includes(game.id);
                const isDisabled =
                  game.status === "INPROGRESS" || game.status === "COMPLETE";
                return (
                  <TableRow
                    key={game.id}
                    className={
                      isUnselected ? "border-4 border-red-500" : "bg-white"
                    }
                  >
                    <TableCell
                      className={`p-2 text-xs h-16 lg:text-base ${
                        selectedTeams[game.id] === game.homeTeamId
                          ? getTipStatusStyles(
                              tips.find(
                                (tip) =>
                                  tip.gameId === game.id &&
                                  tip.teamId === game.homeTeamId
                              )?.status
                            )
                          : !isDisabled
                            ? "hover:bg-gray-100 cursor-pointer"
                            : ""
                      } ${
                        isDisabled && selectedTeams[game.id] !== game.homeTeamId
                          ? "bg-gray-200 opacity-50 pointer-events-none"
                          : ""
                      }`}
                      onClick={() =>
                        !isDisabled &&
                        handleTeamClick(
                          game.id,
                          game.homeTeamId,
                          game.status ?? "SCHEDULED"
                        )
                      }
                    >
                      <div className="flex items-center h-full gap-2">
                        <div
                          className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${homeTeamColors.primary} 50%, ${homeTeamColors.secondary} 50%)`,
                          }}
                        ></div>
                        <div className="text-left flex flex-col justify-center">
                          {renderTeamName(game.homeTeamName)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 text-center text-xs h-16 lg:text-base">
                      {isLive && (
                        <div className="flex items-center justify-center mb-1">
                          <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse mr-2"></div>
                          <span className="text-green-500 text-xs md:text-sm">
                            Live
                          </span>
                        </div>
                      )}
                      {date} <br />
                      {formattedTime}
                      <br />
                      {game.venue}
                    </TableCell>

                    <TableCell
                      className={`text-xs p-2 h-16 lg:text-base ${
                        selectedTeams[game.id] === game.awayTeamId
                          ? getTipStatusStyles(
                              tips.find(
                                (tip) =>
                                  tip.gameId === game.id &&
                                  tip.teamId === game.awayTeamId
                              )?.status
                            )
                          : !isDisabled
                            ? "hover:bg-gray-100 cursor-pointer"
                            : ""
                      } ${
                        isDisabled && selectedTeams[game.id] !== game.awayTeamId
                          ? "bg-gray-200 opacity-50 pointer-events-none"
                          : ""
                      }`}
                      onClick={() =>
                        !isDisabled &&
                        handleTeamClick(
                          game.id,
                          game.awayTeamId,
                          game.status ?? "SCHEDULED"
                        )
                      }
                    >
                      <div className="flex items-center h-full gap-2 justify-end">
                        <div className="text-right flex flex-col justify-center">
                          {renderTeamName(game.awayTeamName)}
                        </div>
                        <div
                          className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10  rounded-full flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${awayTeamColors.primary} 50%, ${awayTeamColors.secondary} 50%)`,
                          }}
                        ></div>
                      </div>
                      <input
                        type="hidden"
                        name={`selectedTeam[${game.id}]`}
                        value={selectedTeams[game.id] || ""}
                      />
                      <input
                        type="hidden"
                        name={`gameDatetime[${game.id}]`}
                        value={game.datetime.toISOString()}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {showSaveButton && (
          <div className="flex justify-end mt-4 px-4 pb-4">
            <Button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save Tips
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
