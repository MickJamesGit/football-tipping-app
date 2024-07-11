"use server";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { States } from "../ui/games/table";

const tipSchema = z.object({
  loggedInUser: z.string().min(1),
  tips: z.array(
    z.object({
      gameId: z.string().min(1),
      tipTeamId: z.string().min(1),
    })
  ),
});

function extractTipsFromFormData(formData: FormData) {
  const tipsArray: any = [];
  const loggedInUser = formData.get("loggedInUser") as string;

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
    loggedInUser,
    tips: tipsArray,
  };
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
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

export async function updateTips(
  state: States,
  formData: FormData
): Promise<{ error: boolean; message: string }> {
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

  const { loggedInUser, tips } = result.data;

  try {
    // Fetch existing tips for the logged-in user
    const existingTips = await sql`
      SELECT game_id, tip_team_id
      FROM tips
      WHERE user_id = ${loggedInUser}
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
          WHERE user_id = ${loggedInUser} AND game_id = ${gameId}
        `;
      } else {
        // Insert a new tip
        await sql`
          INSERT INTO tips (user_id, game_id, tip_team_id)
          VALUES (${loggedInUser}, ${gameId}, ${tipTeamId})
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
