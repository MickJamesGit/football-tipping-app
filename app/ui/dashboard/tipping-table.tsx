"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import React, { useState, useEffect, useRef } from "react";
import { updateTips } from "@/app/lib/actions";
import { useActionState } from "react";
import { Game, teamColors, Tips } from "@/app/lib/definitions";
import { useToast } from "@/components/ui/use-toast";

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
  games: Game[];
  tips: Tips[];
  sportsRounds: { sport: string; rounds: string[]; currentRound: string }[];
  sport: string;
  round: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRound, setSelectedRound] = useState(round);
  const [selectedSport, setSelectedSport] = useState(sport);
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeams>({});
  const [unselectedGames, setUnselectedGames] = useState<string[]>([]);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const initialState: States = { message: "", error: false };
  const [state, formAction] = useActionState(updateTips, initialState);
  const [open, setOpen] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if all games are either 'completed' or 'inprogress'
    const allGamesCompletedOrInProgress = games.every(
      (game) => game.status === "completed" || game.status === "inprogress"
    );
    setShowSaveButton(!allGamesCompletedOrInProgress);
  }, [games, tips]);

  useEffect(() => {
    // Initialize selectedTeams based on existing tips
    const initialSelectedTeams: SelectedTeams = {};
    tips.forEach((tip) => {
      initialSelectedTeams[tip.game_id] = tip.tip_team_id;
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
    <form action={formAction}>
      <div className="border rounded-lg overflow-hidden relative">
        <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-lg font-medium">
              {selectedSport} - Round {selectedRound}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="link"
                  className="text-sm font-medium text-primary-foreground/80"
                >
                  Round {selectedRound} <ChevronDownIcon className="h-6 w-6" />
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="link"
                  className="text-sm font-medium text-primary-foreground/80"
                >
                  {selectedSport} <ChevronDownIcon className="h-6 w-6" />
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
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%] text-left">Home Team</TableHead>
              <TableHead className="w-[20%] text-center">Details</TableHead>
              <TableHead className="w-[40%] text-right">Away Team</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games?.map((game) => {
              const homeTeamColors = teamColors[game.home_team_name] || {
                primary: "#ccc",
                secondary: "#ccc",
              };
              const awayTeamColors = teamColors[game.away_team_name] || {
                primary: "#ccc",
                secondary: "#ccc",
              };
              const dateTime = new Date(game.datetime);
              const currentTime = new Date();

              // Calculate if the game is live
              const timeDifferenceInHours =
                (currentTime.getTime() - dateTime.getTime()) / (1000 * 60 * 60);
              const isLive =
                timeDifferenceInHours >= 0 && timeDifferenceInHours <= 2;

              const date = dateTime.toDateString();
              const hours = dateTime.getHours().toString().padStart(2, "0");
              const minutes = dateTime.getMinutes().toString().padStart(2, "0");
              const formattedTime = `${hours}:${minutes} AEST`;

              const isUnselected = unselectedGames.includes(game.id);
              const isDisabled =
                game.status === "inprogress" || game.status === "completed";
              return (
                <TableRow
                  key={game.id}
                  className={
                    isUnselected ? "border-4 border-red-500" : "bg-white"
                  }
                >
                  <TableCell
                    className={`h-16 ${
                      selectedTeams[game.id] === game.home_team_id
                        ? getTipStatusStyles(
                            tips.find(
                              (tip) =>
                                tip.game_id === game.id &&
                                tip.tip_team_id === game.home_team_id
                            )?.status
                          )
                        : !isDisabled
                          ? "hover:bg-gray-100 cursor-pointer"
                          : ""
                    } ${
                      isDisabled && selectedTeams[game.id] !== game.home_team_id
                        ? "bg-gray-200 opacity-50 pointer-events-none"
                        : ""
                    }`}
                    onClick={() =>
                      !isDisabled &&
                      handleTeamClick(game.id, game.home_team_id, game.status)
                    }
                  >
                    <div className="flex items-center h-full gap-2">
                      <div
                        className="w-10 h-10 rounded-full flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${homeTeamColors.primary} 50%, ${homeTeamColors.secondary} 50%)`,
                        }}
                      ></div>
                      <div className="text-left flex flex-col justify-center">
                        {renderTeamName(game.home_team_name)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-xs h-16 md:text-base text-sm">
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
                    className={`h-16 ${
                      selectedTeams[game.id] === game.away_team_id
                        ? getTipStatusStyles(
                            tips.find(
                              (tip) =>
                                tip.game_id === game.id &&
                                tip.tip_team_id === game.away_team_id
                            )?.status
                          )
                        : !isDisabled
                          ? "hover:bg-gray-100 cursor-pointer"
                          : ""
                    } ${
                      isDisabled && selectedTeams[game.id] !== game.away_team_id
                        ? "bg-gray-200 opacity-50 pointer-events-none"
                        : ""
                    }`}
                    onClick={() =>
                      !isDisabled &&
                      handleTeamClick(game.id, game.away_team_id, game.status)
                    }
                  >
                    <div className="flex items-center h-full gap-2 justify-end">
                      <div className="text-right flex flex-col justify-center">
                        {renderTeamName(game.away_team_name)}
                      </div>
                      <div
                        className="w-10 h-10 rounded-full flex-shrink-0"
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
                      value={game.datetime}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
      </div>
    </form>
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
