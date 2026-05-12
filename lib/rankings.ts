"use server";

import { auth } from "@/auth";
import prisma from "@/prisma";
import { redirect } from "next/navigation";
import { LeaderboardEntry } from "../types/definitions";

const ITEMS_PER_PAGE = 25;

export async function getLeaderboardPages(sport: string): Promise<number> {
  try {
    const totalCount = await prisma.score.count({
      where: {
        sport: sport,
        round: "overall",
      },
    });

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of users with scores.");
  }
}

export async function getOverallSummaryRanking(sports: string[]): Promise<
  {
    score: number;
    ranking: number;
    totalUsers: number;
  }[]
> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }
  const userId = session.user.id;

  try {
    const results = await Promise.all(
      sports.map(async (sport) => {
        const scoreData = await prisma.score.findFirst({
          where: {
            userId: userId,
            sport: sport,
            round: "overall",
          },
          select: {
            score: true,
          },
        });

        const userScore = scoreData?.score ?? 0;

        const ranking =
          (await prisma.score.count({
            where: {
              sport: sport,
              round: "overall",
              score: {
                gt: userScore,
              },
            },
          })) + 1;

        const totalUsers = await prisma.score.count({
          where: {
            sport: sport,
            round: "overall",
          },
        });

        return {
          score: userScore,
          ranking: ranking || 0,
          totalUsers: totalUsers || 0,
        };
      }),
    );

    return results;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch overall rankings.");
  }
}

async function getPreviousRoundScores(
  sport: string,
  season: string,
  previousRound: string,
) {
  return await prisma.score.findMany({
    where: {
      sport: sport,
      season: season,
      round: previousRound,
    },
    select: {
      userId: true,
      score: true,
    },
  });
}

export async function getLeaderboard(
  sport: string,
  season: string,
  previousRound: string,
  currentPage: number,
  query: string,
): Promise<LeaderboardEntry[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Fetch all user scores for the "overall" round
    const allData = await prisma.score.findMany({
      where: {
        sport: sport,
        season: season,
        round: "overall",
      },
      select: {
        user: {
          select: {
            id: true,
            alias: true,
          },
        },
        score: true,
      },
      orderBy: [
        {
          score: "desc",
        },
        {
          user: {
            id: "asc",
          },
        },
      ],
    });

    // Fetch previous round scores
    const previousRoundScores = await getPreviousRoundScores(
      sport,
      season,
      previousRound,
    );

    // Combine data and remove duplicates
    const uniqueData = allData.reduce(
      (acc, current) => {
        const key = `${current.user.id}-${sport}-${season}-overall`;
        if (!acc[key]) {
          const previousRoundScore = previousRoundScores.find(
            (score) => score.userId === current.user.id,
          );

          acc[key] = {
            id: current.user.id,
            alias: current.user.alias ?? "", // Provide fallback if alias is null
            total_points: current.score,
            previous_round_points: previousRoundScore?.score || 0,
            ranking: 0, // Initialize ranking here
          };
        }
        return acc;
      },
      {} as { [key: string]: LeaderboardEntry },
    );

    // Convert object back to an array and assign rankings
    const rankedData = Object.values(uniqueData)
      .map((entry, index) => ({
        ...entry,
        ranking: index + 1, // Ensure ranking is set
      }))
      .sort((a, b) => a.ranking - b.ranking); // Sort by ranking

    // Apply alias filter and pagination
    const filteredData = rankedData.filter((entry) => {
      const alias = entry.alias || ""; // Fallback to an empty string if alias is null or undefined
      const searchQuery = query || ""; // Fallback to an empty string if query is null or undefined
      return alias.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const paginatedData = filteredData.slice(offset, offset + ITEMS_PER_PAGE);

    return paginatedData;
  } catch (err) {
    console.error("Database Error:", err);
    console.error(
      `Failed to fetch leaderboard for sport: ${sport}, season: ${season}, previous round: ${previousRound}`,
    );
    throw new Error("Failed to fetch leaderboard.");
  }
}
