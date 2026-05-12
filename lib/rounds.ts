"use server";

import prisma from "@/prisma";
import { Round } from "@prisma/client";

export async function getAllRoundsAndCurrent(
  sports: string[],
): Promise<{ sport: string; rounds: string[]; currentRound: string | null }[]> {
  try {
    const results = await Promise.all(
      sports.map(async (sport) => {
        const rounds = await prisma.round.findMany({
          where: {
            sport: sport,
            season: "2026",
          },
          orderBy: { startDate: "asc" },
          select: {
            round: true,
          },
        });

        const currentRound = await getCurrentRoundForSport(sport);

        return {
          sport,
          rounds: rounds.map((r) => r.round),
          currentRound: currentRound ? currentRound : null,
        };
      }),
    );

    return results;
  } catch (err) {
    console.error("Database Error:", err);
    console.error(`Failed to fetch rounds for sports: ${sports.join(", ")}`);
    throw new Error("Failed to fetch rounds.");
  }
}

export async function getCurrentRoundForSport(
  sport: string,
): Promise<string | null> {
  try {
    const today = new Date();

    const currentRound = await prisma.round.findFirst({
      where: {
        sport: sport,
        startDate: {
          lte: today,
        },
        endDate: {
          gte: today,
        },
        season: "2026",
      },
      orderBy: { round: "asc" },
      select: {
        round: true, // Only select the round number
      },
    });

    return currentRound?.round || null; // Return only the round number or null
  } catch (err) {
    console.error("Database Error:", err);
    console.error(`Failed to fetch current round for sport: ${sport}`);
    throw new Error("Failed to fetch current round.");
  }
}

export async function getPreviousRound(sport: string): Promise<Round["round"]> {
  const todaysDate = new Date();

  try {
    const previousRound = await prisma.round.findFirst({
      where: {
        sport: sport,
        endDate: {
          lt: todaysDate,
        },
      },
      orderBy: {
        endDate: "desc",
      },
      select: {
        round: true,
      },
    });

    if (!previousRound) {
      return "1";
    }

    return previousRound.round;
  } catch (err) {
    console.error("Database Error:", err);
    console.error(
      `Failed to fetch previous rounds for sport: ${sport}, date: ${todaysDate}`,
    );
    throw new Error("Failed to fetch previous round.");
  }
}
