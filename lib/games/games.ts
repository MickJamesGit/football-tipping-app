"use server";

import { fetchActiveNoResultGames, fetchGames, fetchNextGamesBySports, updateGamesToInProgress } from "./games.repo";
import { GameQueryOptions, gameQuerySchema, GameResponse, NextGameBySportResponse, NextGamesInput, nextGamesSchema } from "./games.schema";

export async function getGames(options: GameQueryOptions) : Promise<GameResponse[]>   {
    const parsed = gameQuerySchema.safeParse(options);

    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }

  return fetchGames(parsed.data);
}

export async function getActiveNoResultGames(): Promise<GameResponse[]>{
  return fetchActiveNoResultGames(new Date());
}

export async function getNextGamesBySports(input: NextGamesInput): Promise<NextGameBySportResponse[]>  {
  const parsed = nextGamesSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid sports input");
  }

  const cleanSports = [...new Set(parsed.data.sports)];

  const now = new Date();

  const games = await fetchNextGamesBySports(cleanSports, now);

  const firstGameBySport = new Map<
    string,
    { sport: string; datetime: Date; round: string }
  >();

  for (const game of games) {
    if (!firstGameBySport.has(game.sport)) {
      firstGameBySport.set(game.sport, game);
    }
  }

return cleanSports.map((sport) => {
  const game = firstGameBySport.get(sport);

  return {
    sport,
    nextGame: game
      ? {
          date: game.datetime,
          round: game.round,
        }
      : null,
  };
});
}

export async function updateGameStatuses(): Promise<{ count: number }> {
  const now = new Date();

  return updateGamesToInProgress(now);
}