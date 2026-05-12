"use server";

import { auth } from "@/auth";
import prisma from "@/prisma";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { AccountDetails } from "../types/definitions";
import {
  accountDetailsSchema,
  accountRegistrationDetailsSchema,
} from "./schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user || null;
  } catch (error) {
    console.error("Failed to retrieve user:", error);
    throw new Error(`An unexpected error has occured.`);
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return user || null;
  } catch (error) {
    console.error("Failed to retrieve user:", error);
    throw new Error(`Unable to retrieve user.`);
  }
}

export async function getUserDetails(userId: string): Promise<AccountDetails> {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      name: true,
      alias: true,
      email: true,
      image: true,
      receiveTippingReminders: true,
      receiveTippingResults: true,
    },
  });

  if (!user) return redirect("/login");

  return user;
}

export async function getUserAliasByUserId(
  userId: string,
): Promise<string | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        alias: true,
      },
    });

    return user ? user.alias : null;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch user alias.");
  }
}

export async function setAccountDetails(
  values: z.infer<typeof accountRegistrationDetailsSchema>,
) {
  const session = await auth();
  if (!session) redirect("/login");

  if (!session || !session.user || !session.user.id) {
    return {
      message: "Error: Unable to set account details.",
    };
  }

  const userId = session.user.id;

  const validatedFields = accountRegistrationDetailsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { message: "Invalid data submitted." };
  }

  const { username, receiveTippingReminders, receiveTippingResults, sports } =
    validatedFields.data;

  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: { id: userId },
        data: {
          alias: username,
          receiveTippingReminders: receiveTippingReminders,
          receiveTippingResults: receiveTippingResults,
        },
      });

      for (const sport of sports) {
        const competition = await prisma.competition.findFirst({
          where: { name: sport },
          select: { id: true },
        });

        if (competition) {
          await prisma.userCompetition.create({
            data: {
              userId: userId,
              competitionId: competition.id,
            },
          });
        }
      }
    });
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Error: Unable to set account details.",
    };
  }
  redirect("/dashboard?initialLogin=true");
}

export async function updateAccountDetails(
  values: z.infer<typeof accountDetailsSchema>,
) {
  const session = await auth();
  if (!session) redirect("/login");

  if (!session.user?.id) {
    return {
      message: "Error: Unable to update account details.",
    };
  }

  const validatedFields = accountDetailsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { message: "Invalid data submitted." };
  }

  const { username, receiveTippingReminders, receiveTippingResults } =
    validatedFields.data;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        alias: username,
        receiveTippingReminders: receiveTippingReminders,
        receiveTippingResults: receiveTippingResults,
      },
    });

    revalidatePath("/dashboard/account");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(`Unable to update user details.`);
  }
}
