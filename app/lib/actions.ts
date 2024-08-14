"use server";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { auth, signIn } from "@/auth";
import { States } from "../ui/dashboard/tipping-table";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import {
  LoginSchema,
  NewPasswordSchema,
  RegisterSchema,
  ResetSchema,
} from "./schemas";
import { generatePasswordResetToken, generateVerificationToken } from "./token";
import bcrypt from "bcryptjs";
import { getPasswordResetTokenByToken, getUserByEmail } from "./data";
import { sendPasswordResetEmail, sendVerificationEmail } from "./mail";
import { PasswordResetToken, VerificationToken, Session } from "./definitions";
import dayjs from "dayjs";

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

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email and/or password." };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid email and/or password." };
  }

  if (!(await bcrypt.compare(password, existingUser.password))) {
    return {
      error: "Invalid email and/or password.",
    };
  }

  if (!existingUser.emailVerified) {
    return {
      error: "Email not verified.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
    return { success: "Successfully logged in!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email and/or password." };
        default:
          return { error: "Invalid email and/or password." };
      }
    }

    throw error;
  }
};

export const signup = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields submitted. Review entries and resubmit." };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email is already registered." };
  }

  // Begin a transaction to ensure atomicity
  const transaction = await sql`BEGIN`;

  try {
    // Insert user into database
    const user = await sql`
      INSERT INTO users (name, email, password) 
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id
    `;

    const userId = user.rows[0].id;

    // Insert user account into accounts table using the returned userId
    await sql`
      INSERT INTO accounts ("userId", type, provider, "providerAccountId") 
      VALUES (${userId}, 'credentials', 'credentials', ${userId})
    `;

    // Generate verification token
    const verificationToken = await generateVerificationToken(email);
    if (!verificationToken) {
      throw new Error("Failed to generate verification token.");
    }

    // Send verification email
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    // Commit the transaction if everything is successful
    await sql`COMMIT`;

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error); // Detailed logging
    await sql`ROLLBACK`;
    return { error: "An error occurred during signup. Please try again." };
  }
};

export const verifyEmail = async (token: string) => {
  // Fetch the verification token record from the database
  const result = await sql`
    SELECT email, expires 
    FROM verification_token 
    WHERE token = ${token}
  `;

  // If no record is found, return an error
  if (result.rowCount === 0) {
    return { error: "Invalid or expired token." };
  }

  const { email, expires } = result.rows[0];

  // Check if the token is expired
  if (dayjs().isAfter(dayjs(expires))) {
    return { error: "Token has expired." };
  }

  // Token is valid, update user's emailVerified field
  const now = dayjs().toISOString();
  await sql`
  UPDATE users
  SET "emailVerified" = ${now}
  WHERE email = ${email}
`;

  // Optionally, delete the used token
  await sql`
    DELETE FROM verification_token
    WHERE token = ${token}
  `;

  return { success: "Email verified successfully." };
};

export async function facebookAuthenticate() {
  try {
    const session = await auth();
    if (session) {
      redirect("/dashboard");
    } else {
      await signIn("facebook", { redirectTo: "/dashboard" });
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

export async function deleteVerificationToken(token: string): Promise<boolean> {
  try {
    const result =
      await sql`DELETE FROM verification_token WHERE token=${token} RETURNING *`;
    return result.rows.length > 0;
  } catch {
    return false;
  }
}

export async function deletePasswordResetToken(
  token: string
): Promise<boolean> {
  try {
    const result =
      await sql`DELETE FROM password_reset_token WHERE token=${token} RETURNING *`;
    return result.rows.length > 0;
  } catch {
    return false;
  }
}

export async function createPasswordResetToken(
  email: string,
  token: string,
  expires: Date
): Promise<PasswordResetToken | null> {
  try {
    const expiresFormatted = expires.toISOString();
    const result =
      await sql<PasswordResetToken>`INSERT INTO password_reset_token (email, token, expires) VALUES (${email}, ${token}, ${expiresFormatted}) RETURNING *`;
    return result.rows[0];
  } catch (error) {
    console.error("Error creating password reset token:", error);
    return null;
  }
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

export async function saveGameResults(
  state: States,
  formData: FormData
): Promise<{ error: boolean; message: string }> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { error: true, message: "You must be logged in to save scores." };
  }

  if (session.user.id !== "c5281d79-bbc3-41b8-a41b-56b408afee59") {
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

  const currentDateTime = new Date().toISOString();

  try {
    await sql`BEGIN`;

    for (const result of results) {
      const {
        gameId,
        homeScore,
        awayScore,
        homeTeamId,
        awayTeamId,
        round,
        sport,
      } = result;

      // Ensure scores are valid integers, defaulting to 0 if they are not
      const parsedHomeScore = isNaN(parseInt(homeScore!.toString(), 10))
        ? 0
        : parseInt(homeScore!.toString(), 10);
      const parsedAwayScore = isNaN(parseInt(awayScore!.toString(), 10))
        ? 0
        : parseInt(awayScore!.toString(), 10);

      // Skip processing if both scores are zero
      if (parsedHomeScore === 0 && parsedAwayScore === 0) {
        console.log(
          `Skipping game ID: ${gameId} due to invalid or missing scores.`
        );
        continue;
      }

      let winningTeamId: string | null = null;
      if (parsedHomeScore > parsedAwayScore) {
        winningTeamId = homeTeamId;
      } else if (parsedAwayScore > parsedHomeScore) {
        winningTeamId = awayTeamId;
      }

      await sql`
        UPDATE games
        SET 
          winning_team_id = ${winningTeamId},
          home_team_score = ${homeScore},
          away_team_score = ${awayScore},
          status = 'completed',
          updated_at = ${currentDateTime}
        WHERE 
          id = ${gameId}`;

      const tips = await sql`
        SELECT * FROM tips WHERE game_id = ${gameId}`;

      for (const tip of tips.rows) {
        const isCorrect = tip.tip_team_id === winningTeamId;
        const status = isCorrect ? "correct" : "incorrect";

        await sql`
          UPDATE tips
          SET status = ${status}
          WHERE id = ${tip.id}`;

        if (isCorrect) {
          const season = 2024;
          const overallRound = "overall";
          const scoreIncrement = 1;

          await sql`
              INSERT INTO scores (user_id, round, score, season, sport)
              VALUES (${tip.user_id}, ${round}, ${scoreIncrement}, ${season}, ${sport})
              ON CONFLICT (user_id, round, season, sport) DO UPDATE
              SET score = scores.score + ${scoreIncrement}`;

          // Update overall score
          await sql`
              INSERT INTO scores (user_id, round, score, season, sport)
              VALUES (${tip.user_id}, ${overallRound}, ${scoreIncrement}, ${season}, ${sport})
              ON CONFLICT (user_id, round, season, sport) DO UPDATE
              SET score = scores.score + ${scoreIncrement}`;
        }
      }
    }

    await sql`COMMIT`;

    return {
      error: false,
      message: "Scores saved and tips graded successfully.",
    };
  } catch (err) {
    await sql`ROLLBACK`;
    console.error("Database Error:", err);
    return {
      error: true,
      message: "Unable to save scores due to a database error.",
    };
  }
}

export async function createSession(
  userId: string,
  sessionToken: string,
  expires: Date
): Promise<Session | null> {
  try {
    const expiresFormatted = expires.toISOString();
    const result = await sql<Session>`
      INSERT INTO sessions ("userId", "sessionToken", "expires") 
      VALUES (${userId}, ${sessionToken}, ${expiresFormatted}) 
      RETURNING *`;
    return result.rows[0];
  } catch (error) {
    console.error("Error creating session:", error);
    return null;
  }
}

export async function createVerificationToken(
  email: string,
  token: string,
  expires: Date
): Promise<VerificationToken | null> {
  try {
    const expiresFormatted = expires.toISOString();
    const result =
      await sql<VerificationToken>`INSERT INTO verification_token (email, token, expires) VALUES (${email}, ${token}, ${expiresFormatted}) RETURNING *`;
    return result.rows[0];
  } catch (error) {
    console.error("Error creating verification token:", error);
    return null;
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

export const resetPassword = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email." };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      success:
        "If an account with the provided email exists, you will receive an email shortly with instructions to reset your password.",
    };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  if (!passwordResetToken) {
    throw new Error("Failed to generate password reset token.");
  }

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return {
    success:
      "If an account with the provided email exists, you will receive an email shortly with instructions to reset your password.",
  };
};

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "An error has occured." };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token." };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired." };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await updatePassword(existingUser.id, hashedPassword);

  await deletePasswordResetToken(existingToken.id);

  return { success: "Password updated!" };
};

async function updatePassword(userId: string, hashedPassword: string) {
  try {
    const result = await sql`
      UPDATE users
      SET password = ${hashedPassword}
      WHERE id = ${userId}
      RETURNING *;
    `;

    return result.rows[0]; // Returns the updated user record
  } catch (error) {
    console.error("Error updating password:", error);
    throw new Error("Could not update password");
  }
}
