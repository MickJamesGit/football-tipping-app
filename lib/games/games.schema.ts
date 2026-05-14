import { Prisma } from "@prisma/client";
import { z } from "zod";

export type GameResponse ={
  id: string;
  sport: string;
  round: string;
  datetime: Date;
  status: string;
  venue: string;
  homeTeamId: string;
  awayTeamId: string;

  homeTeam: {
    name: string;
    ranking: number | null;
  };

  awayTeam: {
    name: string;
    ranking: number | null;
  };
};

export type NextGameBySportResponse = {
  sport: string;
  nextGame: {
    date: Date;
    round: string;
  } | null;
};

export const gameQuerySchema = z.object({
  sport: z.array(z.string()).min(1),
  round: z.string().optional(),
  status: z.enum(["SCHEDULED", "INPROGRESS", "COMPLETE"]).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export const nextGamesSchema = z.object({
  sports: z.array(z.string()).min(1),
});

export type NextGamesInput = z.infer<typeof nextGamesSchema>;

export type GameQueryOptions = z.infer<typeof gameQuerySchema>;

export type GameWithTeamsAndRankings = Prisma.GameGetPayload<{
  include: {
    homeTeam: {
      select: {
        name: true;
        ranking: true;
      };
    };
    awayTeam: {
      select: {
        name: true;
        ranking: true;
      };
    };
  };
}>;

export type NextGameBySport = {
  sport: string;
  nextGameDate: Date | null;
  nextGameRound: string | null;
};