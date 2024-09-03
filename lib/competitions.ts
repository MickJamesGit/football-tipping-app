"use server";

import prisma from "@/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { setUserTipsToAwayTeams } from "./tips";
import { revalidatePath } from "next/cache";

export async function getActiveCompetitions(): Promise<string[]> {
  const todaysDate = new Date();

  try {
    const sports = await prisma.competition.findMany({
      where: {
        startDate: {
          lte: todaysDate,
        },
        endDate: {
          gte: todaysDate,
        },
      },
      select: {
        name: true,
      },
    });

    return sports.map((competition) => competition.name);
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch active competitions.");
  }
}

export async function getUserRegisteredCompetitions(): Promise<string[]> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }
  const userId = session.user.id;

  const todaysDate = new Date();

  try {
    const signedUpCompetitions = await prisma.competition.findMany({
      where: {
        id: {
          in: (
            await prisma.userCompetition.findMany({
              where: {
                userId: userId,
              },
              select: {
                competitionId: true,
              },
            })
          ).map((uc) => uc.competitionId),
        },
        startDate: {
          lte: todaysDate,
        },
        endDate: {
          gte: todaysDate,
        },
      },
      select: {
        name: true,
      },
    });

    return signedUpCompetitions.map((comp) => comp.name);
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch user competitions.");
  }
}

export async function getUserUnregisteredCompetitions(): Promise<
  {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    userCount: number;
  }[]
> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }
  const userId = session.user.id;
  const todaysDate = new Date();

  try {
    const notSignedUpCompetitions = await prisma.competition.findMany({
      where: {
        id: {
          notIn: (
            await prisma.userCompetition.findMany({
              where: {
                userId: userId,
              },
              select: {
                competitionId: true,
              },
            })
          ).map((uc) => uc.competitionId),
        },
        startDate: {
          lte: todaysDate,
        },
        endDate: {
          gte: todaysDate,
        },
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        _count: {
          select: {
            userCompetitions: true,
          },
        },
      },
    });

    return notSignedUpCompetitions.map((competition) => ({
      id: competition.id,
      name: competition.name,
      startDate: competition.startDate.toISOString(),
      endDate: competition.endDate.toISOString(),
      userCount: competition._count.userCompetitions,
    }));
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch unregistered competitions.");
  }
}

export async function updateUserCompetitions(competitionId: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }

  try {
    const existingRegistration = await prisma.userCompetition.findUnique({
      where: {
        userId_competitionId: {
          userId: session.user.id,
          competitionId: competitionId,
        },
      },
    });

    if (existingRegistration) {
      console.log("User is already registered for this competition.");
      return redirect("/dashboard/tipping");
    }

    await prisma.userCompetition.create({
      data: {
        userId: session.user.id,
        competitionId: competitionId,
      },
    });
    console.log("User registered successfully.");

    const competitionDetails = await prisma.competition.findUnique({
      where: { id: competitionId },
      select: { name: true },
    });

    if (competitionDetails) {
      await setUserTipsToAwayTeams(competitionDetails.name);
    } else {
      console.error("Competition details not found.");
    }

    return revalidatePath("/dashboard/tipping");
  } catch (error) {
    console.error("Error registering for competition:", error);
    throw error;
  }
}
