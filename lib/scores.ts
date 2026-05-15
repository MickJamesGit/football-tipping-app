"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/prisma";
import { requireAuth } from "./auth/requireAdmin";

export async function getLastRoundScores(sports: string[]): Promise<
  {
    roundNumber: string;
    score: number;
    totalGames: number;
  }[]
> {
  const session = await requireAuth();
  
  const userId = session.id;
  const todaysDate = new Date();

  try {
    const results = await Promise.all(
      sports.map(async (sport) => {
        const lastRound = await prisma.round.findFirst({
          where: {
            sport: sport,
            endDate: {
              lte: todaysDate,
            },
          },
          orderBy: {
            endDate: "desc",
          },
          select: {
            round: true,
          },
        });

        const roundNumber = lastRound?.round || "1";

        const scoreData = await prisma.score.findFirst({
          where: {
            userId: userId,
            sport: sport,
            round: roundNumber,
          },
          select: {
            score: true,
          },
        });

        const totalGamesData = await prisma.game.count({
          where: {
            sport: sport,
            round: roundNumber,
            status: "COMPLETE",
          },
        });

        return {
          roundNumber,
          score: scoreData?.score || 0,
          totalGames: totalGamesData || 0,
        };
      }),
    );

    return results;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch last round scores.");
  }
}

export async function updateUserScores(
  userId: string,
  sport: string,
  round: string,
) {
  // Calculate the correct tips for the user in this round
  const correctTipsCount = await prisma.tip.count({
    where: {
      userId: userId,
      status: "CORRECT",
      games: {
        sport: sport,
        season: "2026",
        round: round,
      },
    },
  });

  // Insert or update the score for the round
  await prisma.score.upsert({
    where: {
      userId_round_season_sport: {
        userId: userId,
        sport: sport,
        season: "2026",
        round: round,
      },
    },
    update: {
      score: correctTipsCount,
      updatedAt: new Date(),
    },
    create: {
      userId: userId,
      sport: sport,
      season: "2026",
      round: round,
      score: correctTipsCount,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function updateOverallScore(userId: string, sport: string) {
  // Calculate the total correct tips for the user across all rounds
  const overallCorrectTipsCount = await prisma.tip.count({
    where: {
      userId: userId,
      status: "CORRECT",
      games: {
        sport: sport,
        season: "2026",
      },
    },
  });

  // Insert or update the overall score
  await prisma.score.upsert({
    where: {
      userId_round_season_sport: {
        userId: userId,
        sport: sport,
        season: "2026",
        round: "overall",
      },
    },
    update: {
      score: overallCorrectTipsCount,
      updatedAt: new Date(),
    },
    create: {
      userId: userId,
      sport: sport,
      season: "2026",
      round: "overall",
      score: overallCorrectTipsCount,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}
