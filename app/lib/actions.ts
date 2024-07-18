"use server";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { auth, signIn } from "@/auth";
import { States } from "../ui/dashboard/tipping/table";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

const tipSchema = z.object({
  tips: z.array(
    z.object({
      gameId: z.string().min(1),
      tipTeamId: z.string().min(1),
    })
  ),
});

const usernameSchema = z.string().min(5).max(25);

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

export async function googleAuthenticate() {
  try {
    const session = await auth();
    if (session) {
      redirect("/dashboard");
    } else {
      await signIn("google", { redirectTo: "/dashboard" });
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function facebookAuthenticate() {
  try {
    await signIn("facebook");
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function setUsername(
  state: States,
  formData: FormData
): Promise<{ error: boolean; message: string }> {
  const session = await auth();
  if (!session) redirect("/login");

  if (!session.user?.id) {
    return {
      error: true,
      message: "Error: Unable to set username.",
    };
  }
  const alias = formData.get("alias");
  const result = usernameSchema.safeParse(alias);

  if (!result.success) {
    console.error("Validation Error:", result.error.issues);
    return {
      error: true,
      message: "Error: Unable to save username. Please try again.",
    };
  }

  const username = result.data;

  try {
    const updatedUsername = await sql`
      UPDATE users
SET alias = ${username}
WHERE id = ${session.user.id}
    `;

    return { error: false, message: "Success" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      error: true,
      message: "Error: Unable to save username.",
    };
  }
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
      message: "Error: Unable to save tips. Please try again.",
    };
  }

  const tipsData = extractTipsFromFormData(formData);
  // Validate the data
  const result = tipSchema.safeParse(tipsData);

  if (!result.success) {
    console.error("Validation Error:", result.error.issues);
    return {
      error: true,
      message: "Error: Unable to save tips. Please try again.",
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
          message: `Error: Unable to save tips. Please try again.`,
        };
      }
      const gameDatetime = new Date(gameDatetimeStr.toString());
      if (currentTime >= gameDatetime) {
        return {
          error: true,
          message: `Error: Game has already started.`,
        };
      }
    }

    // Fetch existing tips for the logged-in user
    const existingTips = await sql`
      SELECT game_id, tip_team_id
      FROM tips
      WHERE user_id = ${session.user.id}
    `;

    // Create a map of existing tips for quick lookup
    const existingTipsMap = new Map();
    existingTips.rows.map((tip) => {
      existingTipsMap.set(tip.game_id, tip.tip_team_id);
    });

    for (const tip of tips) {
      const { gameId, tipTeamId } = tip;

      if (existingTipsMap.has(gameId)) {
        // Update the existing tip
        await sql`
          UPDATE tips
          SET tip_team_id = ${tipTeamId}
          WHERE user_id = ${session.user.id} AND game_id = ${gameId}
        `;
      } else {
        // Insert a new tip
        await sql`
          INSERT INTO tips (user_id, game_id, tip_team_id)
          VALUES (${session.user.id}, ${gameId}, ${tipTeamId})
        `;
      }
    }
    return { error: false, message: "Success! Your tips have been saved." };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      error: true,
      message: "Error: Unable to save tips. Please try again.",
    };
  }
}

export async function updateGameStatuses() {
  try {
    await sql`
      UPDATE games
      SET status = 'inprogress'
      WHERE datetime <= NOW() AND status != 'inprogress' AND status != 'completed';
    `;
    console.log("Game statuses updated successfully.");
  } catch (error) {
    console.error("Error updating game statuses:", error);
  }
}
