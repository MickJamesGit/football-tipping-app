"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/use-toast";
import { useRouter } from "next/navigation";
import { saveGameResults } from "@/lib/admin";
import { GameWithTeamNames } from "@/types/definitions";
import { useFormState } from "react-dom";

interface ResultsFormProps {
  unresultedGames: GameWithTeamNames[];
}

export type States = {
  error?: boolean;
  message?: string | null;
};

export default function ResultsForm({ unresultedGames }: ResultsFormProps) {
  const [scores, setScores] = useState<{
    [key: string]: { homeScore: string; awayScore: string };
  }>({});
  const initialState: States = { message: "", error: false };
  const [state, formAction] = useFormState(saveGameResults, initialState);
  const { toast } = useToast();
  const router = useRouter();

  const handleScoreChange = (
    gameId: string,
    teamType: "homeScore" | "awayScore",
    value: string,
  ) => {
    setScores((prevScores) => ({
      ...prevScores,
      [gameId]: {
        ...prevScores[gameId],
        [teamType]: value,
      },
    }));
  };

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
      if (!state.error) {
        router.refresh();
      }
    }
  }, [state, router, toast]);

  return (
    <form action={formAction}>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Sport</th>
            <th className="px-4 py-2 border-b">Round</th>
            <th className="px-4 py-2 border-b">Datetime</th>
            <th className="px-4 py-2 border-b">Home Team</th>
            <th className="px-4 py-2 border-b">Away Team</th>
            <th className="px-4 py-2 border-b">Home Team Score</th>
            <th className="px-4 py-2 border-b">Away Team Score</th>
          </tr>
        </thead>
        <tbody>
          {unresultedGames.map((game) => (
            <tr key={game.id}>
              <td className="px-4 py-2 border-b">
                <input
                  type="hidden"
                  name={`games[${game.id}][gameId]`}
                  value={game.id}
                />
                <input
                  type="hidden"
                  name={`games[${game.id}][homeTeamId]`}
                  value={game.homeTeamId}
                />
                <input
                  type="hidden"
                  name={`games[${game.id}][awayTeamId]`}
                  value={game.awayTeamId}
                />
                <input
                  type="hidden"
                  name={`games[${game.id}][round]`}
                  value={game.round}
                />
                <input
                  type="hidden"
                  name={`games[${game.id}][sport]`}
                  value={game.sport}
                />
                {game.sport}
              </td>
              <td className="px-4 py-2 border-b">{game.round}</td>
              <td className="px-4 py-2 border-b">
                {new Date(game.datetime).toLocaleString()}
              </td>
              <td className="px-4 py-2 border-b">{game.homeTeamName}</td>
              <td className="px-4 py-2 border-b">{game.awayTeamName}</td>
              <td className="px-4 py-2 border-b">
                <input
                  type="number"
                  name={`games[${game.id}][homeScore]`}
                  value={scores[game.id]?.homeScore || ""}
                  onChange={(e) =>
                    handleScoreChange(game.id, "homeScore", e.target.value)
                  }
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="px-4 py-2 border-b">
                <input
                  type="number"
                  name={`games[${game.id}][awayScore]`}
                  value={scores[game.id]?.awayScore || ""}
                  onChange={(e) =>
                    handleScoreChange(game.id, "awayScore", e.target.value)
                  }
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="submit"
        className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit Scores
      </button>
    </form>
  );
}
