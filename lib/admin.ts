"use server";

import { auth } from "@/auth";
import { States } from "@/components/dashboard/admin/results/results-form";
import prisma from "@/prisma";

export async function saveGameResults(
  state: States,
  formData: FormData
): Promise<{ error: boolean; message: string }> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { error: true, message: "You must be logged in to save scores." };
  }

  if (session.user.id !== "56c47f5e-6481-48e9-99e0-d9f1434a98f1") {
    return {
      error: true,
      message: "You are not authorized to save scores.",
    };
  }

  const results: GameResult[] = [];

  // Iterate through formData to group data by gameId
  const gamesData: { [key: string]: any } = {};

  formData.forEach((value, key) => {
    const match = key.match(/^games\[(.+?)\]\[(.+?)\]$/);
    if (match) {
      const gameId = match[1];
      const field = match[2];
      if (!gamesData[gameId]) {
        gamesData[gameId] = {};
      }
      gamesData[gameId][field] = value;
    }
  });

  // Process each game
  for (const gameId in gamesData) {
    const gameData = gamesData[gameId];
    const homeScore = gameData.homeScore;
    const awayScore = gameData.awayScore;
    const homeTeamId = gameData.homeTeamId;
    const awayTeamId = gameData.awayTeamId;
    const round = gameData.round;
    const sport = gameData.sport;

    if (
      homeScore !== null &&
      awayScore !== null &&
      typeof homeTeamId === "string" &&
      typeof awayTeamId === "string" &&
      typeof round === "string" &&
      typeof sport === "string"
    ) {
      results.push({
        gameId,
        homeScore: parseInt(homeScore.toString(), 10),
        awayScore: parseInt(awayScore.toString(), 10),
        homeTeamId,
        awayTeamId,
        round,
        sport,
      });
    }
  }

  if (results.length === 0) {
    return { error: true, message: "No valid game data submitted." };
  }

  for (const result of results) {
    try {
      await prisma.$transaction(async (prisma: any) => {
        const {
          gameId,
          homeScore,
          awayScore,
          homeTeamId,
          awayTeamId,
          round,
          sport,
        } = result;

        const competition = await prisma.competition.findFirst({
          where: { name: sport },
          select: { id: true },
        });

        if (!competition) {
          throw new Error(`Competition not found for sport = ${sport}.`);
        }

        const competitionId = competition.id;

        const parsedHomeScore = isNaN(parseInt(homeScore!.toString(), 10))
          ? 0
          : parseInt(homeScore!.toString(), 10);
        const parsedAwayScore = isNaN(parseInt(awayScore!.toString(), 10))
          ? 0
          : parseInt(awayScore!.toString(), 10);

        if (parsedHomeScore === 0 && parsedAwayScore === 0) {
          console.log(
            `Skipping game ID: ${gameId} due to invalid or missing scores.`
          );
          return;
        }

        let winningTeamId: string | null = null;
        if (parsedHomeScore > parsedAwayScore) {
          winningTeamId = homeTeamId;
        } else if (parsedAwayScore > parsedHomeScore) {
          winningTeamId = awayTeamId;
        }

        await prisma.game.update({
          where: { id: gameId },
          data: {
            winningTeamId: winningTeamId,
            homeTeamScore: parsedHomeScore,
            awayTeamScore: parsedAwayScore,
            status: "COMPLETE",
            updatedAt: new Date(),
          },
        });

        const tips = await prisma.tip.findMany({
          where: { gameId: gameId },
        });

        const usersWithTips = tips.map((tip: any) => tip.userId);

        const usersInCompetition = await prisma.userCompetition.findMany({
          where: { competitionId: competitionId },
          select: { userId: true },
        });

        const usersWithoutTips = usersInCompetition.filter(
          (user: any) => !usersWithTips.includes(user.userId)
        );

        for (const user of usersWithoutTips) {
          await prisma.tip.create({
            data: {
              userId: user.userId,
              gameId: gameId,
              teamId: awayTeamId,
              status: "PENDING",
            },
          });
        }

        // Re-fetch all tips, including the newly created ones
        const allTips = await prisma.tip.findMany({
          where: { gameId: gameId },
        });

        for (const tip of allTips) {
          const isCorrect = tip.teamId === winningTeamId;
          const status = isCorrect ? "CORRECT" : "INCORRECT";

          await prisma.tip.update({
            where: { id: tip.id },
            data: { status },
          });

          if (isCorrect) {
            const season = "2024";
            const scoreIncrement = 1;

            await prisma.score.upsert({
              where: {
                userId_round_season_sport: {
                  userId: tip.userId,
                  round: round,
                  season: season,
                  sport: sport,
                },
              },
              update: {
                score: { increment: scoreIncrement },
              },
              create: {
                userId: tip.userId,
                round: round,
                score: scoreIncrement,
                season: season,
                sport: sport,
              },
            });

            await prisma.score.upsert({
              where: {
                userId_round_season_sport: {
                  userId: tip.userId,
                  round: "overall",
                  season: season,
                  sport: sport,
                },
              },
              update: {
                score: { increment: scoreIncrement },
              },
              create: {
                userId: tip.userId,
                round: "overall",
                score: scoreIncrement,
                season: season,
                sport: sport,
              },
            });
          }
        }
      });
    } catch (err) {
      console.error(`Error saving results for game ID: ${result.gameId}`, err);
      return {
        error: true,
        message: `Unable to save scores for game ID: ${result.gameId} due to a database error.`,
      };
    }
  }

  return {
    error: false,
    message: "Scores saved and tips graded successfully.",
  };
}

interface GameResult {
  gameId: string;
  homeScore: number | null;
  awayScore: number | null;
  homeTeamId: string;
  awayTeamId: string;
  round: string;
  sport: string;
}
