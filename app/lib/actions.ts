"use server";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { auth, signIn } from "@/auth";
import { States } from "../ui/dashboard/tipping/table";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

const tipSchema = z.object({
  tips: z.array(
    z.object({
      gameId: z.string().min(1),
      tipTeamId: z.string().min(1),
    })
  ),
});

const usernameSchema = z.string().min(5).max(25);

const preferencesSchema = z.boolean();

const sportsSchema = z.array(z.string().min(1));

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

  const selectedSports = JSON.parse(formData.get("selectedSports") as string);
  const result2 = sportsSchema.safeParse(selectedSports);

  if (!result2.success) {
    console.error("Validation Error:", result2.error.issues);
    return {
      error: true,
      message: "Error: Unable to save sports selections. Please try again.",
    };
  }

  const username = result.data;
  const sports = result2.data;

  try {
    // Start a transaction
    await sql`BEGIN`;

    const updatedUsername = await sql`
      UPDATE users
SET alias = ${username}
WHERE id = ${session.user.id}
    `;

    // Check each selected sport and create entries in user_competitions
    for (const sport of sports) {
      const competitionResult = await sql`
              SELECT id
              FROM competitions
              WHERE name = ${sport}
            `;

      const competition = competitionResult.rows[0];

      if (competition) {
        await sql`
                INSERT INTO user_competitions (user_id, competition_id)
                VALUES (${session.user.id}, ${competition.id})
              `;
      }
    }

    // Commit the transaction
    await sql`COMMIT`;

    return { error: false, message: "Success" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      error: true,
      message: "Error: Unable to save username and sports selections.",
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
    return { error: false, message: "Tips saved. Good luck!" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      error: true,
      message: "Unable to save tips. Please try again.",
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

export async function setNewUserTips(
  userId: string,
  sport: string,
  season: string
) {
  try {
    // Start a transaction
    await sql`BEGIN`;

    // Get all game IDs, away team IDs, and winning team IDs for the given sport and season
    const gameResult = await sql`
      SELECT id, away_team_id, winning_team_id
      FROM games 
      WHERE sport = ${sport} AND season = ${season} AND winning_team_id IS NOT NULL
    `;

    const games = gameResult.rows;

    if (games.length === 0) {
      console.log("No games have results yet. No tips to set.");
      await sql`ROLLBACK`;
      return;
    }

    // Insert tips for each game for the new user
    for (const game of games) {
      const status =
        game.winning_team_id === game.away_team_id ? "correct" : "incorrect";

      await sql`
        INSERT INTO tips (user_id, tip_team_id, game_id, created_at, updated_at, status) 
        VALUES (${userId}, ${game.away_team_id}, ${game.id}, NOW(), NOW(), ${status})
      `;
    }

    // Commit the transaction
    await sql`COMMIT`;

    console.log("New user tips set successfully.");
  } catch (error) {
    // Rollback the transaction in case of an error
    await sql`ROLLBACK`;
    console.error("Error setting new user tips:", error);
  }
}

export async function updateUserCompetitions(competitionId: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }

  try {
    const existingRegistration = await sql`
      SELECT 1 FROM user_competitions 
      WHERE user_id = ${session.user.id} AND competition_id = ${competitionId}
    `;

    if (existingRegistration.rows.length > 0) {
      console.log("User is already registered for this competition.");
      return redirect("/dashboard/tipping");
    }

    await sql`
      INSERT INTO user_competitions (user_id, competition_id) 
      VALUES (${session.user.id}, ${competitionId})
    `;
    console.log("User registered successfully.");
    redirect("/dashboard/tipping");
  } catch (error) {
    console.error("Error registering for competition:", error);
    throw error;
  }
}

export async function updateAccountDetails(
  state: States,
  formData: FormData
): Promise<{ error: boolean; message: string }> {
  const session = await auth();
  if (!session) redirect("/login");

  if (!session.user?.id) {
    return {
      error: true,
      message: "Error: Unable to update account details.",
    };
  }
  console.log(formData);
  const alias = formData.get("username");
  console.log(alias);
  const result = usernameSchema.safeParse(alias);

  if (!result.success) {
    console.error("Validation Error:", result.error.issues);
    return {
      error: true,
      message:
        "Error: Unable to update account details. Usernames must be between 5 and 25 characters.",
    };
  }

  const receiveTippingReminders =
    formData.get("receiveTippingReminders") === "true";
  console.log(receiveTippingReminders);
  const receiveTippingResults =
    formData.get("receiveTippingResults") === "true";

  const remindersResult = preferencesSchema.safeParse(receiveTippingReminders);
  const resultsResult = preferencesSchema.safeParse(receiveTippingResults);

  if (!remindersResult.success || !resultsResult.success) {
    console.error("Preferences save error");
    return {
      error: true,
      message: "Error: Unable to update account details.",
    };
  }

  const username = result.data;

  try {
    // Start a transaction
    await sql`BEGIN`;

    // Update the username
    await sql`
      UPDATE users
      SET alias = ${username}
      WHERE id = ${session.user.id}
    `;

    // Update the communication preferences
    await sql`
      UPDATE users
      SET receive_tipping_reminders = ${receiveTippingReminders},
          receive_tipping_results = ${receiveTippingResults}
      WHERE id = ${session.user.id}
    `;

    // Commit the transaction
    await sql`COMMIT`;
    revalidatePath("/dashboard/account");
    return { error: false, message: "Success" };
  } catch (error) {
    // Rollback the transaction in case of an error
    await sql`ROLLBACK`;
    console.error("Database Error:", error);
    return {
      error: true,
      message: "Error: Unable to update account details",
    };
  }
}
