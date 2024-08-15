"use server";

import { sql } from "@vercel/postgres";
import {
  Team,
  Game,
  Tips,
  Round,
  LeaderboardEntry,
  User,
  VerificationToken,
  PasswordResetToken,
} from "./definitions";
import { getTodaysDate } from "./utils";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const ITEMS_PER_PAGE = 25;

export async function fetchLeaderboardPages(sport: string) {
  try {
    const countResult = await sql`
      SELECT COUNT(*)
      FROM scores
      WHERE sport = ${sport}
        AND round = 'overall'
    `;

    const totalCount = Number(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of users with scores.");
  }
}

export async function fetchTeams() {
  try {
    const data = await sql<Team>`
SELECT
  id,
  name,
  sport
FROM teams
WHERE sport = 'NRL' AND name LIKE 'C%'
ORDER BY name ASC
    `;

    const teams = data.rows;
    return teams;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all teams.");
  }
}

export async function fetchGames(sport: string, round: string) {
  try {
    const data = await sql<Game>`
    SELECT
      g.id,
      g.sport,
      g.round,
      g.home_team_id,
      g.away_team_id,
      t1.name AS home_team_name,
      t2.name AS away_team_name,
      g.venue,
      g.datetime,
      g.season,
      g.winning_team_id,
      g.status
    FROM
      games g
    JOIN
      teams t1 ON g.home_team_id = t1.id
    JOIN
      teams t2 ON g.away_team_id = t2.id
    WHERE
      g.sport = ${sport} AND g.round = ${round}
    ORDER BY
      g.datetime;
    `;

    const games = data.rows.map((game) => ({
      ...game,
    }));
    return games;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all games.");
  }
}

export async function fetchGameTips(gameIds: string[]) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }
  const user_id = session.user.id;

  const gameIdsString = JSON.stringify(gameIds);
  try {
    // Use parameterized queries to handle arrays correctly
    const data = await sql`
      SELECT
        t.game_id,
        t.tip_team_id,
        teams.name AS tip_team_name
      FROM
        tips t
      JOIN
        teams ON t.tip_team_id = teams.id
      WHERE
        t.game_id = ANY(${gameIdsString}) AND t.user_id = ${user_id}
    `;

    // Map the results to the desired format
    const tips = data.rows.map((tip) => ({
      game_id: tip.game_id,
      tip_team_id: tip.tip_team_id,
      tip_team_name: tip.tip_team_name,
    }));

    return tips;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch tips.");
  }
}

export async function fetchTips(sport: string, round: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }
  const user_id = session.user.id;
  try {
    const data = await sql<Tips>`
      SELECT
        t.id,
        t.user_id,
        t.tip_team_id,
        t.game_id,
        t.status,
        t.created_at,
        t.updated_at
      FROM
        tips t
      JOIN
        games g ON t.game_id = g.id
      WHERE
        g.sport = ${sport} AND g.round = ${round} AND t.user_id = ${user_id}
      ORDER BY
        g.datetime;
    `;

    const tips = data.rows.map((tip) => ({
      id: tip.id,
      user_id: tip.user_id,
      tip_team_id: tip.tip_team_id,
      game_id: tip.game_id,
      status: tip.status,
    }));
    return tips;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch tips.");
  }
}

export async function fetchLeaderboard(
  sport: string,
  season: string,
  previousRound: string,
  currentPage: number,
  query: string
): Promise<LeaderboardEntry[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Step 1: Fetch all user scores and calculate their rankings
    const allData = await sql<LeaderboardEntry>`
      SELECT
        u.id AS id,
        u.alias AS alias,
        s.score AS total_points,
        COALESCE(ps.score, 0) AS previous_round_points
      FROM
        scores s
      JOIN
        users u ON s.user_id = u.id
      LEFT JOIN
        scores ps ON ps.user_id = u.id AND ps.round = ${previousRound}
      WHERE
        s.sport = ${sport} AND
        s.season = ${season} AND
        s.round = 'overall'
      ORDER BY
        s.score DESC, u.id
    `;

    // Step 2: Remove duplicates based on unique user, sport, season, and round
    const uniqueData = allData.rows.reduce((acc, current) => {
      const key = `${current.id}-${sport}-${season}-overall`;
      if (!acc[key]) {
        acc[key] = current;
      }
      return acc;
    }, {});

    // Convert object back to an array
    const rankedData = Object.values(uniqueData).map((entry, index) => ({
      ...entry,
      ranking: index + 1,
    }));

    // Step 3: Apply the alias filter and pagination
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
      `Failed to fetch leaderboard for sport: ${sport}, season: ${season}, previous round: ${previousRound}`
    );
    throw new Error("Failed to fetch leaderboard.");
  }
}

export async function fetchCurrentRound(
  sport: string
): Promise<Round["round"]> {
  const todays_date = getTodaysDate();
  try {
    console.log(sport);
    const data = await sql<Round>`
      SELECT
        r.id AS id,
        r.round_number AS round,
        r.start_date AS start_date,
        r.end_date AS end_date
      FROM
        rounds r
      WHERE
        r.sport = ${sport} AND ${todays_date} BETWEEN r.start_date AND r.end_date AND season = '2024'
    `;

    if (data.rows.length === 0) {
      return "1";
    }

    const currentRound = data.rows.map((round) => ({
      id: round.id,
      round: round.round,
      start_date: round.start_date,
      end_date: round.end_date,
    }));

    return currentRound[0].round;
  } catch (err) {
    console.error("Database Error:", err);
    console.error(
      `Failed to fetch rounds for sport: ${sport}, date: ${todays_date}`
    );
    throw new Error("Failed to fetch current round.");
  }
}

export async function fetchPreviousRound(
  sport: string
): Promise<Round["round"]> {
  const todays_date = getTodaysDate();
  try {
    const data = await sql<Round>`
      SELECT
        r.id AS id,
        r.round_number AS round,
        r.start_date AS start_date,
        r.end_date AS end_date
      FROM
        rounds r
      WHERE
        r.sport = ${sport} AND r.end_date < ${todays_date}
      ORDER BY
        r.end_date DESC
      LIMIT 1
    `;

    if (data.rows.length === 0) {
      return "1";
    }

    const previousRound = data.rows.map((round) => ({
      id: round.id,
      round: round.round,
      start_date: round.start_date,
      end_date: round.end_date,
    }));

    return previousRound[0].round;
  } catch (err) {
    console.error("Database Error:", err);
    console.error(
      `Failed to fetch previous rounds for sport: ${sport}, date: ${todays_date}`
    );
    throw new Error("Failed to fetch previous round.");
  }
}

type UserRanking = {
  sportName: string;
  lastRoundNumber: number;
  lastRoundCorrectGames: number;
  lastRoundTotalGames: number;
  overallTippingPoints: number;
  overallRanking: number;
  overallNumberOfUsers: number;
};

export async function fetchUserRankingSummary(
  sport: string,
  round: string
): Promise<UserRanking | null> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }
  const userId = session.user.id;

  try {
    // Fetch user scores for the given sport, season, and round
    const userScoreData = await sql<{ id: string; total_points: number }>`
      SELECT
        u.id AS id,
        s.score AS total_points
      FROM
        scores s
      JOIN
        users u ON s.user_id = u.id
      WHERE
        s.sport = ${sport} AND
        s.season = '2024' AND
        s.round = ${round} AND
        s.user_id = ${userId}
    `;

    // Fetch overall scores for all users
    const overallData = await sql<{ id: string; total_points: number }>`
      SELECT
        u.id AS id,
        s.score AS total_points
      FROM
        scores s
      JOIN
        users u ON s.user_id = u.id
      WHERE
        s.sport = ${sport} AND
        s.season = '2024' AND
        s.round = 'overall'
      ORDER BY
        s.score DESC
    `;

    // Fetch total games for the round
    const totalGamesData = await sql<{ total_games: number }>`
      SELECT
        COUNT(*) AS total_games
      FROM
        games
      WHERE
        sport = ${sport} AND
        season = '2024' AND
        round = ${round}
    `;

    const totalGames = totalGamesData.rows[0]?.total_games || 0;
    const userScore = userScoreData.rows[0]?.total_points || 0;

    // Assign rankings to the overall dataset
    const overallRankedData = overallData.rows.map((entry, index) => ({
      id: entry.id,
      total_points: entry.total_points,
      ranking: index + 1,
    }));

    // Find the overall ranking of the specific user
    const overallUserRanking = overallRankedData.find(
      (entry) => entry.id === userId
    );

    if (overallUserRanking) {
      return {
        sportName: sport,
        lastRoundNumber: parseInt(round, 10),
        lastRoundCorrectGames: userScore,
        lastRoundTotalGames: totalGames,
        overallTippingPoints: overallUserRanking.total_points,
        overallRanking: overallUserRanking.ranking,
        overallNumberOfUsers: overallRankedData.length,
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error("Database Error:", err);
    console.error(
      `Failed to fetch user ranking for sport: ${sport}, season: 2024, round: ${round}, user ID: ${userId}`
    );
    throw new Error("Failed to fetch user ranking.");
  }
}

export type TipResult = {
  id: string;
  tip_team_name: string;
  game_id: string;
  status: string;
  home_team_name: string;
  away_team_name: string;
};

export async function fetchLatestTipResults(
  user_id: string,
  sport: string
): Promise<TipResult[]> {
  try {
    const data = await sql<TipResult>`
      SELECT
        t.id,
        tt.name AS tip_team_name,
        t.game_id,
        t.status,
        ht.name AS home_team_name,
        at.name AS away_team_name
      FROM
        tips t
      JOIN
        games g ON t.game_id = g.id
      JOIN
        teams ht ON g.home_team_id = ht.id
      JOIN
        teams at ON g.away_team_id = at.id
      JOIN
        teams tt ON t.tip_team_id = tt.id
      WHERE
        g.sport = ${sport} AND t.user_id = ${user_id} AND t.status != 'pending'
      ORDER BY
        g.datetime DESC
      LIMIT 5;
    `;

    return data.rows;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch tips.");
  }
}

export async function fetchRoundTotalUsers(sport: string, round: string) {
  try {
    const countResult = await sql`
      SELECT COUNT(*)
      FROM scores
      WHERE sport = ${sport}
        AND round = ${round}
    `;

    const totalCount = Number(countResult.rows[0].count);

    return totalCount;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of users with scores.");
  }
}

export async function fetchUserdetails(
  userId: string
): Promise<{ alias: string; image: string; name: string }> {
  try {
    const data = await sql`
      SELECT alias, image, name
      FROM users
      WHERE id = ${userId}
    `;

    if (data.rows.length === 0) {
      throw new Error("User not found");
    }

    const { alias, image, name } = data.rows[0];

    return { alias, image, name };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user details.");
  }
}

export async function fetchUpcomingGames(sports: string[]) {
  try {
    // Convert the array of sports to a format that can be used in the SQL query
    const sportsList = sports.join(",");

    const data = await sql<Game>`
    SELECT
      g.id,
      g.sport,
      g.round,
      g.home_team_id,
      g.away_team_id,
      t1.name AS home_team_name,
      t2.name AS away_team_name,
      g.venue,
      g.datetime,
      g.season,
      g.winning_team_id,
      g.status
    FROM
      games g
    JOIN
      teams t1 ON g.home_team_id = t1.id
    JOIN
      teams t2 ON g.away_team_id = t2.id
    WHERE
      g.sport = ANY (string_to_array(${sportsList}, ',')::text[]) AND g.status='scheduled'
    ORDER BY
      g.datetime
    LIMIT 6
    `;

    const games = data.rows.map((game) => ({
      ...game,
    }));
    return games;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all games.");
  }
}

export async function fetchAllRounds(
  sports: string[]
): Promise<{ sport: string; rounds: string[]; currentRound: string }[]> {
  const sportsList = sports.join(",");
  const todaysDate = new Date(getTodaysDate()); // Ensure this function returns the current date in 'YYYY-MM-DD' format

  try {
    const data = await sql<{
      sport: string;
      round: string;
      start_date: string;
      end_date: string;
    }>`
      SELECT
        r.sport,
        r.round_number AS round,
        r.start_date,
        r.end_date
      FROM
        rounds r
      WHERE
        r.sport = ANY (string_to_array(${sportsList}, ',')::text[]) AND r.season = '2024'
      ORDER BY
        r.sport ASC,
        r.round_number ASC
    `;

    // Group rounds by sport and find the current round
    const roundsBySport: {
      [key: string]: { rounds: string[]; currentRound: string };
    } = {};
    data.rows.forEach(({ sport, round, start_date, end_date }) => {
      if (!roundsBySport[sport]) {
        roundsBySport[sport] = { rounds: [], currentRound: "" };
      }
      roundsBySport[sport].rounds.push(round);

      // Convert start_date and end_date to Date objects
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      // Logic to determine the current round
      if (todaysDate >= startDate && todaysDate <= endDate) {
        roundsBySport[sport].currentRound = round;
      }
    });

    // Convert the object to an array of { sport, rounds, currentRound } objects
    const result = Object.keys(roundsBySport).map((sport) => ({
      sport,
      rounds: roundsBySport[sport].rounds,
      currentRound: roundsBySport[sport].currentRound,
    }));

    return result;
  } catch (err) {
    console.error("Database Error:", err);
    console.error(`Failed to fetch rounds for sports: ${sports.join(", ")}`);
    throw new Error("Failed to fetch rounds.");
  }
}

export async function getUserAlias(userId: string): Promise<string | null> {
  try {
    // Correct the query syntax and parameterization
    const data = await sql<User>`SELECT alias FROM users WHERE id = ${userId}`;

    if (data.rows.length > 0) {
      return data.rows[0].alias;
    } else {
      return null; // Return null if user is not found
    }
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch user alias.");
  }
}

// Define the Game interface according to the structure of your data
interface ActiveGame {
  id: string;
  sport: string;
  round: number;
  datetime: string;
  home_team_id: string;
  home_team_name: string;
  away_team_id: string;
  away_team_name: string;
}

export async function getActiveNoResultGames(): Promise<ActiveGame[] | null> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }

  if (session.user.id !== "c5281d79-bbc3-41b8-a41b-56b408afee59") {
    return null;
  }

  const currentDateTime = new Date().toISOString(); // Convert the Date object to an ISO string

  try {
    const result = await sql<ActiveGame>`
      SELECT 
        g.id,
        g.sport,
        g.round,
        g.datetime,
        g.home_team_id,
        home_team.name as home_team_name,
        g.away_team_id,
        away_team.name as away_team_name
      FROM 
        games g
      JOIN 
        teams home_team ON g.home_team_id = home_team.id
      JOIN 
        teams away_team ON g.away_team_id = away_team.id
      WHERE 
        g.datetime <= ${currentDateTime} AND g.winning_team_id IS NULL`;

    if (result.rows.length > 0) {
      // Map over the rows to transform the data if needed
      const games = result.rows.map((game) => ({
        ...game,
      }));
      return games;
    } else {
      return null; // Return null if no games are found
    }
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch active no-result games.");
  }
}

export async function fetchActiveSports(): Promise<string[]> {
  const todays_date = getTodaysDate();
  try {
    const data = await sql<{ name: string }>`
      SELECT s.name AS name
      FROM competitions s
      WHERE ${todays_date} BETWEEN s.start_date AND s.end_date
    `;

    const sports = data.rows.map((row) => row.name);
    return sports;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch active sports.");
  }
}

export async function fetchUserCompetitions(): Promise<{
  userCompetitions: {
    signedUp: {
      id: string;
      name: string;
    }[];
    notSignedUp: {
      id: string;
      name: string;
      startDate: string;
      endDate: string;
      userCount: number;
    }[];
  };
}> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }
  const userId = session.user.id;
  const todays_date = getTodaysDate();
  try {
    const signedUpData = await sql<{
      id: string;
      name: string;
    }>`
      SELECT c.id, c.name
      FROM competitions c
      WHERE c.id IN (
        SELECT uc.competition_id
        FROM user_competitions uc
        WHERE uc.user_id = ${userId}
      )
      AND ${todays_date} BETWEEN c.start_date AND c.end_date
    `;

    const notSignedUpData = await sql<{
      id: string;
      name: string;
      start_date: string;
      end_date: string;
      userCount: number;
    }>`
      SELECT c.id, c.name, c.start_date, c.end_date, COUNT(uc.user_id) AS "userCount"
      FROM competitions c
      LEFT JOIN user_competitions uc ON c.id = uc.competition_id
      WHERE c.id NOT IN (
        SELECT uc.competition_id
        FROM user_competitions uc
        WHERE uc.user_id = ${userId}
      )
      AND ${todays_date} BETWEEN c.start_date AND c.end_date
      GROUP BY c.id, c.name, c.start_date, c.end_date
    `;

    const userCompetitions = {
      signedUp: signedUpData.rows,
      notSignedUp: notSignedUpData.rows.map((row) => ({
        id: row.id,
        name: row.name,
        startDate: row.start_date,
        endDate: row.end_date,
        userCount: row.userCount,
      })),
    };
    return { userCompetitions };
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch user competitions.");
  }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE id=${id}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function getVerificationTokenByToken(
  token: string
): Promise<VerificationToken | null> {
  try {
    const verificationToken =
      await sql<VerificationToken>`SELECT * FROM verification_token WHERE token=${token}`;
    return verificationToken.rows[0];
  } catch {
    return null;
  }
}

export async function getPasswordResetTokenByToken(
  token: string
): Promise<PasswordResetToken | null> {
  try {
    const passwordResetToken =
      await sql<PasswordResetToken>`SELECT * FROM password_reset_token WHERE token=${token}`;
    return passwordResetToken.rows[0];
  } catch {
    return null;
  }
}

export async function getPasswordResetTokenByEmail(
  email: string
): Promise<PasswordResetToken | null> {
  try {
    const passwordResetToken =
      await sql<PasswordResetToken>`SELECT * FROM password_reset_token WHERE email=${email}`;
    return passwordResetToken.rows[0];
  } catch {
    return null;
  }
}

export async function getVerificationTokenByEmail(
  email: string
): Promise<VerificationToken | null> {
  try {
    const verificationToken =
      await sql<VerificationToken>`SELECT * FROM verification_token WHERE email=${email}`;
    return verificationToken.rows[0];
  } catch {
    return null;
  }
}

export async function fetchLastRoundScores(sports: string[]): Promise<
  {
    roundNumber: string;
    score: number;
    totalGames: number;
  }[]
> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }
  const userId = session.user.id;
  const todays_date = getTodaysDate();

  try {
    const results = await Promise.all(
      sports.map(async (sport) => {
        const lastRound = await sql<{
          round_number: string;
          end_date: string;
        }>`
        SELECT round_number, end_date
        FROM rounds
        WHERE sport = ${sport}
        AND end_date = (
          SELECT MAX(end_date)
          FROM rounds
          WHERE sport = ${sport}
          AND end_date <= ${todays_date}
        )
      `;

        const roundNumber =
          lastRound.rows.length === 0 ? "1" : lastRound.rows[0].round_number;

        const scoreData = await sql<{
          score: number;
        }>`
        SELECT score
        FROM scores
        WHERE user_id = ${userId}
        AND sport = ${sport}
        AND round = ${roundNumber}
      `;

        const totalGamesData = await sql<{
          total_games: number;
        }>`
        SELECT COUNT(*) AS total_games
        FROM games
        WHERE sport = ${sport}
        AND round = ${roundNumber}
      `;

        return {
          roundNumber,
          score: scoreData.rows[0]?.score || 0,
          totalGames: totalGamesData.rows[0]?.total_games || 0,
        };
      })
    );

    console.log(results);
    return results;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch last round scores.");
  }
}

export async function fetchNextGameDates(
  sports: string[]
): Promise<{ sport: string; nextGameDate: string; nextGameRound: string }[]> {
  const todays_date = getTodaysDate();

  try {
    const results = await Promise.all(
      sports.map(async (sport) => {
        const nextGameData = await sql<{
          start_date: string;
          round: string;
        }>`
        SELECT datetime AS start_date, round
        FROM games
        WHERE sport = ${sport}
        AND datetime > ${todays_date}
        ORDER BY datetime ASC
        LIMIT 1
      `;

        if (nextGameData.rows.length === 0) {
          return {
            sport,
            nextGameDate: "No upcoming games found",
            nextGameRound: "N/A",
          };
        }

        const { start_date, round } = nextGameData.rows[0];
        return { sport, nextGameDate: start_date, nextGameRound: round };
      })
    );
    console.log(results);
    return results;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch next game dates.");
  }
}

export async function fetchOverallRanking(sports: string[]): Promise<
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
        const scoreData = await sql<{
          score: number;
          ranking: number;
        }>`
        SELECT
          score,
          RANK() OVER (ORDER BY score DESC) AS ranking
        FROM scores
        WHERE user_id = ${userId}
        AND sport = ${sport}
        AND round = 'overall'
      `;

        const totalUsersData = await sql<{
          total_users: number;
        }>`
        SELECT COUNT(*) AS total_users
        FROM scores
        WHERE sport = ${sport}
        AND round = 'overall'
      `;

        return {
          score: scoreData.rows[0]?.score || 0,
          ranking: scoreData.rows[0]?.ranking || 0,
          totalUsers: totalUsersData.rows[0]?.total_users || 0,
        };
      })
    );

    console.log(results);
    return results;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch overall ranking.");
  }
}

export async function fetchAccountDetails(): Promise<{
  name: string;
  alias: string;
  image: string;
  email: string;
  receiveTippingReminders: boolean;
  receiveTippingResults: boolean;
}> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }
  const userId = session.user.id;

  try {
    const userData = await sql<{
      name: string;
      alias: string;
      image: string;
      email: string;
      receiveTippingReminders: boolean;
      receiveTippingResults: boolean;
    }>`
    SELECT
      name,
      alias,
      image,
      email,
      receive_tipping_reminders AS "receiveTippingReminders",
      receive_tipping_results AS "receiveTippingResults"
    FROM users
    WHERE id = ${userId}
  `;

    if (userData.rows.length === 0) {
      throw new Error("User not found.");
    }

    const userDetails = userData.rows[0];

    return {
      name: userDetails.name,
      alias: userDetails.alias,
      email: userDetails.email,
      image: userDetails.image,
      receiveTippingReminders: userDetails.receiveTippingReminders,
      receiveTippingResults: userDetails.receiveTippingResults,
    };
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch account details.");
  }
}
