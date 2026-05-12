"use server";

import prisma from "@/prisma";
import { competitions } from "@/seed/data/competitions";
import { games } from "@/seed/data/games";
import { rounds } from "@/seed/data/rounds";
import { teams } from "@/seed/data/teams";

//Seeds the entire database. Will ignore if things are already set, so it can be run multiple times.
export async function seedDatabase() {
  seedCompetitions()
    .then(() => {
      console.log("Competitions seeded successfully.");
    })
    .catch((error) => {
      console.error("Error seeding competitions:", error);
    });

  seedTeams()
    .then(() => {
      console.log("Teams seeded successfully.");
    })
    .catch((error) => {
      console.error("Error seeding teams:", error);
    });

  seedRounds()
    .then(() => {
      console.log("Rounds seeded successfully.");
    })
    .catch((error) => {
      console.error("Error seeding rounds:", error);
    });

  seedGames()
    .then(() => {
      console.log("Games seeded successfully.");
    })
    .catch((error) => {
      console.error("Error seeding games:", error);
    });
}

async function seedCompetitions() {
  for (const competition of competitions) {
    await prisma.competition.upsert({
      where: {
        name: competition.name,
      },
      update: {
        startDate: competition.startDate,
        endDate: competition.endDate,
      },
      create: {
        name: competition.name,
        startDate: competition.startDate,
        endDate: competition.endDate,
      },
    });
  }
}

async function seedTeams() {
  for (const team of teams) {
    await prisma.team.upsert({
      where: {
        name: team.name,
      },
      update: {},
      create: {
        name: team.name,
        sport: team.sport,
      },
    });
  }
}

async function seedRounds() {
  for (const round of rounds) {
    await prisma.round.upsert({
      where: {
        sport_season_round: {
          sport: round.sport,
          season: round.season,
          round: round.round,
        },
      },
      update: {},
      create: {
        sport: round.sport,
        season: round.season,
        round: round.round,
        startDate: round.startDate,
        endDate: round.endDate,
      },
    });
  }
}

async function seedGames() {
  for (const game of games) {
    const homeTeam = await prisma.team.findUnique({
      where: { name: game.homeTeamName },
    });

    const awayTeam = await prisma.team.findUnique({
      where: { name: game.awayTeamName },
    });

    if (!homeTeam || !awayTeam) {
      console.error(
        `Team not found: ${game.homeTeamName} or ${game.awayTeamName}`,
      );
      continue; // Skip this game if either team is not found
    }

    await prisma.game.upsert({
      where: {
        sport_season_round_homeTeamId_awayTeamId: {
          sport: game.sport,
          season: game.season,
          round: game.round,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
        },
      },
      update: {},
      create: {
        sport: game.sport,
        round: game.round,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        venue: game.venue,
        datetime: game.datetime,
        season: game.season,
        winningTeamId: game.winningTeamId,
        status: game.status,
      },
    });
  }
}
