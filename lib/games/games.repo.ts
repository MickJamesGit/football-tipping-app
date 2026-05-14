import prisma from "../../prisma";
import { GameQueryOptions } from "./games.schema";

export async function fetchGames(options: GameQueryOptions) {
  return prisma.game.findMany({
    where: {
      sport: { in: options.sport },
      round: options.round,
      status: options.status,
    },
    take: options.limit,
    orderBy: { datetime: "asc" },

    select: {
      id: true,
      sport: true,
      round: true,
      datetime: true,
      status: true,
      venue: true,
      homeTeamId: true,
      awayTeamId: true,

      homeTeam: {
        select: {
          name: true,
          ranking: true,
        },
      },

      awayTeam: {
        select: {
          name: true,
          ranking: true,
        },
      },
    },
  });
}

export async function fetchActiveNoResultGames(
  currentDateTime: Date
) {
  return prisma.game.findMany({
    where: {
      datetime: {
        lte: currentDateTime,
      },
      winningTeamId: null,
    },
    select: {
      id: true,
      sport: true,
      round: true,
      datetime: true,
      status: true,
      venue: true,
      homeTeamId: true,
      awayTeamId: true,

      homeTeam: {
        select: {
          name: true,
          ranking: true,
        },
      },
      awayTeam: {
        select: {
          name: true,
          ranking: true,
        },
      },
    },
  });
}

export async function fetchNextGamesBySports(
  sports: string[],
  after: Date
): Promise<{ sport: string; datetime: Date; round: string }[]> {
  return prisma.game.findMany({
    where: {
      sport: { in: sports },
      datetime: { gt: after },
    },
    orderBy: { datetime: "asc" },
    select: {
      sport: true,
      datetime: true,
      round: true,
    },
  });
}

export async function updateGamesToInProgress(now: Date) : Promise<{ count: number }>{
  return prisma.game.updateMany({
    where: {
      datetime: { lte: now },
      status: {
        notIn: ["INPROGRESS", "COMPLETE"],
      },
    },
    data: {
      status: "INPROGRESS",
    },
  });
}