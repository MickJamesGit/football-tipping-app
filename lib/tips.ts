"use server";

import { auth } from "@/auth";
import prisma from "@/prisma";
import { redirect } from "next/navigation";
import { Tips } from "../types/definitions";
import { tipSchema } from "./schemas";
import { updateOverallScore, updateUserScores } from "./scores";
import { States } from "@/components/dashboard/admin/results/results-form";

export async function getTipsBySportRound(
  sport: string,
  round: string
): Promise<Tips[]> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }
  const userId = session.user.id;

  try {
    const tips = await prisma.tip.findMany({
      where: {
        userId: userId,
        games: {
          sport: sport,
          round: round,
        },
      },
      select: {
        teamId: true,
        gameId: true,
        status: true,
      },
      orderBy: {
        games: {
          datetime: "asc",
        },
      },
    });

    return tips;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch tips.");
  }
}

function extractTipsFromFormData(formData: FormData) {
  const tipsArray: any = [];

  formData.forEach((value, key) => {
    const match = key.match(/selectedTeam\[([a-zA-Z0-9-]+)\]/);
    if (match && value) {
      tipsArray.push({
        gameId: match[1],
        tipTeamId: value as string,
      });
    }
  });

  return {
    tips: tipsArray,
  };
}

export async function updateTips(
  state: States,
  formData: FormData
): Promise<{ error: boolean; message: string }> {
  const session = await auth();
  if (!session) redirect("/login");

  if (!session.user?.id) {
    return {
      error: true,
      message: "Unable to save tips.",
    };
  }

  const tipsData = extractTipsFromFormData(formData);
  // Validate the data
  const result = tipSchema.safeParse(tipsData);

  if (!result.success) {
    console.error("Validation Error:", result.error.issues);
    return {
      error: true,
      message: "Unable to save tips. Please try again.",
    };
  }

  const { tips } = result.data;

  try {
    const currentTime = new Date();

    for (const tip of tips) {
      const gameId = tip.gameId;
      const gameDatetimeStr = formData.get(`gameDatetime[${gameId}]`);
      if (!gameDatetimeStr) {
        return {
          error: true,
          message: `Unable to save tips. Please try again.`,
        };
      }
      const gameDatetime = new Date(gameDatetimeStr.toString());
      if (currentTime >= gameDatetime) {
        return {
          error: true,
          message: `Game has already started.`,
        };
      }
    }

    // Fetch existing tips for the logged-in user
    const existingTips = await prisma.tip.findMany({
      where: { userId: session.user.id },
      select: { gameId: true, teamId: true },
    });

    // Create a map of existing tips for quick lookup
    const existingTipsMap = new Map(
      existingTips.map((tip) => [tip.gameId, tip.teamId])
    );

    for (const tip of tips) {
      const { gameId, tipTeamId } = tip;

      if (existingTipsMap.has(gameId)) {
        // Update the existing tip
        await prisma.tip.updateMany({
          where: {
            userId: session.user.id,
            gameId: gameId,
          },
          data: {
            teamId: tipTeamId,
          },
        });
      } else {
        // Insert a new tip
        await prisma.tip.create({
          data: {
            userId: session.user.id,
            gameId: gameId,
            teamId: tipTeamId,
          },
        });
      }
    }
    return { error: false, message: "Tips saved. Good luck!" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      error: true,
      message: "Unable to save tips. Please try again.",
    };
  }
}

export async function setUserTipsToAwayTeams(sport: string) {
  const session = await auth();
  if (!session) redirect("/login");

  if (!session.user?.id) {
    return {
      error: true,
      message: "Unable to save tips.",
    };
  }

  const userId = session.user.id;

  // Step 1: Fetch completed games for the specified sport and season
  const completedGames = await prisma.game.findMany({
    where: {
      sport: sport,
      season: "2024",
      status: "COMPLETE",
    },
    select: {
      id: true,
      awayTeamId: true,
      winningTeamId: true,
      round: true,
    },
  });

  // Array to store promises for inserting tips
  const tipInsertPromises = [];

  // Step 2: Loop through each completed game and set the user's tip
  for (const game of completedGames) {
    const {
      id: gameId,
      awayTeamId: awayTeamId,
      winningTeamId: winningTeamId,
      round,
    } = game;

    // Determine if the tip is correct or incorrect
    const tipStatus = awayTeamId === winningTeamId ? "CORRECT" : "INCORRECT";

    // Step 3: Insert user's tip for the away team
    tipInsertPromises.push(
      prisma.tip.create({
        data: {
          userId: userId,
          teamId: awayTeamId,
          gameId: gameId,
          status: tipStatus,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    );
  }

  // Step 4: Wait for all tip insertions to complete
  await Promise.all(tipInsertPromises);

  // Step 5: Update user's scores only after all tips have been graded
  // Update user's score for each round
  const rounds = [...new Set(completedGames.map((game) => game.round))];
  for (const round of rounds) {
    await updateUserScores(userId, sport, round);
  }

  // Step 6: Update user's overall score
  await updateOverallScore(userId, sport);

  return { error: false, message: "Tips and scores updated successfully." };
}

export async function setNewUserTips(
  userId: string,
  sport: string,
  season: string
) {
  try {
    // Start a transaction
    await prisma.$transaction(async (prisma) => {
      // Get all game IDs, away team IDs, and winning team IDs for the given sport and season
      const games = await prisma.game.findMany({
        where: {
          sport: sport,
          season: season,
          winningTeamId: { not: null },
        },
        select: {
          id: true,
          awayTeamId: true,
          winningTeamId: true,
        },
      });

      if (games.length === 0) {
        console.log("No games have results yet. No tips to set.");
        return;
      }

      // Insert tips for each game for the new user
      const tipInsertPromises = games.map((game) => {
        const status =
          game.winningTeamId === game.awayTeamId ? "CORRECT" : "INCORRECT";

        return prisma.tip.create({
          data: {
            userId: userId,
            teamId: game.awayTeamId,
            gameId: game.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: status,
          },
        });
      });

      await Promise.all(tipInsertPromises);

      console.log("New user tips set successfully.");
    });
  } catch (error) {
    console.error("Error setting new user tips:", error);
    throw new Error("Failed to set new user tips");
  }
}

export async function getTipsByGames(
  gameIds: string[]
): Promise<{ gameId: string; teamName: string }[]> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }
  const userId = session.user.id;

  try {
    const tips = await prisma.tip.findMany({
      where: {
        userId: userId,
        gameId: {
          in: gameIds,
        },
      },
      select: {
        gameId: true,
        teams: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        games: {
          datetime: "asc",
        },
      },
    });

    const flattenedTips = tips.map((tip) => ({
      gameId: tip.gameId,
      teamName: tip.teams.name,
    }));

    return flattenedTips;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch tips.");
  }
}
