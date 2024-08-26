"use server";
import prisma from "@/prisma";
import { GameWithTeamNames, GameWithRankings } from "../types/definitions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function getGames(
  sport: string,
  round: string
): Promise<GameWithTeamNames[] | null> {
  try {
    const games = await prisma.game.findMany({
      where: {
        sport: sport,
        round: round,
      },
      include: {
        homeTeam: {
          select: {
            name: true,
          },
        },
        awayTeam: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        datetime: "asc",
      },
    });

    if (games.length === 0) {
      return null;
    }

    const gamesWithTeamNames: GameWithTeamNames[] = games.map((game) => ({
      ...game,
      homeTeamName: game.homeTeam.name,
      awayTeamName: game.awayTeam.name,
    }));

    return gamesWithTeamNames;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all games.");
  }
}

export async function getUpcomingGames(
  sports: string[]
): Promise<GameWithRankings[] | null> {
  try {
    const games = await prisma.game.findMany({
      where: {
        sport: {
          in: sports,
        },
        status: "SCHEDULED",
      },
      include: {
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
      orderBy: {
        datetime: "asc",
      },
      take: 6, // Limit to 6 upcoming games
    });

    const gamesWithTeamNamesRankings: GameWithRankings[] = games.map(
      (game) => ({
        ...game,
        homeTeamName: game.homeTeam.name,
        homeTeamRanking: game.homeTeam.ranking,
        awayTeamName: game.awayTeam.name,
        awayTeamRanking: game.awayTeam.ranking,
      })
    );

    return gamesWithTeamNamesRankings;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch upcoming games.");
  }
}

export async function getActiveNoResultGames(): Promise<
  GameWithTeamNames[] | null
> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }

  //Restricted to admin
  if (session.user.id !== "56c47f5e-6481-48e9-99e0-d9f1434a98f1") {
    return null;
  }

  const currentDateTime = new Date();

  try {
    const games = await prisma.game.findMany({
      where: {
        datetime: {
          lte: currentDateTime,
        },
        winningTeamId: null,
      },
      include: {
        homeTeam: {
          select: {
            name: true,
          },
        },
        awayTeam: {
          select: {
            name: true,
          },
        },
      },
    });

    if (games.length > 0) {
      // Return all fields from the games table along with team names
      const activeGames = games.map((game) => ({
        ...game,
        homeTeamName: game.homeTeam.name,
        awayTeamName: game.awayTeam.name,
      }));
      return activeGames;
    } else {
      return null;
    }
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch active no-result games.");
  }
}

export async function getNextGameDatesBySports(
  sports: string[]
): Promise<{ sport: string; nextGameDate: string; nextGameRound: string }[]> {
  const todaysDate = new Date();

  try {
    const results = await Promise.all(
      sports.map(async (sport) => {
        const nextGameData = await prisma.game.findFirst({
          where: {
            sport: sport,
            datetime: {
              gt: todaysDate,
            },
          },
          orderBy: {
            datetime: "asc",
          },
          select: {
            datetime: true,
            round: true,
          },
        });

        if (!nextGameData) {
          return {
            sport,
            nextGameDate: "No upcoming games found",
            nextGameRound: "N/A",
          };
        }

        const { datetime: start_date, round } = nextGameData;
        return {
          sport,
          nextGameDate: start_date.toISOString(),
          nextGameRound: round,
        };
      })
    );

    console.log(results);
    return results;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch next game dates.");
  }
}

export async function updateGameStatuses() {
  try {
    await prisma.game.updateMany({
      where: {
        datetime: {
          lte: new Date(),
        },
        status: {
          notIn: ["INPROGRESS", "COMPLETE"],
        },
      },
      data: {
        status: "INPROGRESS",
      },
    });
    console.log("Game statuses updated successfully.");
  } catch (error) {
    console.error("Error updating game statuses:", error);
  }
}
