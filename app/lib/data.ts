import { sql } from "@vercel/postgres";
import {
  Team,
  Game,
  Tips,
  Round,
  Sport,
  LeaderboardEntry,
  User,
} from "./definitions";
import { getTodaysDate } from "./utils";
import { Competition, UserCompetitions } from "../dashboard/tipping/page";

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

export async function fetchTips(user_id: string, round: string, sport: string) {
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
        ps.score AS previous_round_points
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
        total_points DESC
    `;

    // Step 2: Assign rankings to the full dataset
    const rankedData = allData.rows.map((entry, index) => ({
      ...entry,
      previous_round_points: entry.previous_round_points || 0,
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
  todays_date: string,
  sport: Sport
): Promise<Round["round"]> {
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
        r.sport = ${sport} AND ${todays_date} BETWEEN r.start_date AND r.end_date
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
  todays_date: string,
  sport: Sport
): Promise<Round["round"]> {
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
  ranking: number;
  total_points: number;
} | null;

export async function fetchUserRankingSummary(
  sport: string,
  season: string,
  userId: string,
  round: string
): Promise<UserRanking> {
  try {
    // Step 1: Fetch all user scores for the given sport, season, and round
    const allData = await sql<{ id: string; total_points: number }>`
      SELECT
        u.id AS id,
        s.score AS total_points
      FROM
        scores s
      JOIN
        users u ON s.user_id = u.id
      WHERE
        s.sport = ${sport} AND
        s.season = ${season} AND
        s.round = ${round}
      ORDER BY
        s.score DESC
    `;

    // Step 2: Assign rankings to the dataset
    const rankedData = allData.rows.map((entry, index) => ({
      id: entry.id,
      total_points: entry.total_points,
      ranking: index + 1,
    }));

    // Step 3: Find the ranking of the specific user
    const userRanking = rankedData.find((entry) => entry.id === userId);

    if (userRanking) {
      return {
        ranking: userRanking.ranking,
        total_points: userRanking.total_points,
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error("Database Error:", err);
    console.error(
      `Failed to fetch user ranking for sport: ${sport}, season: ${season}, round: ${round}, user ID: ${userId}`
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

export async function fetchUpcomingGames(sport: string) {
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
      g.sport = ${sport} AND g.status='upcoming'
    ORDER BY
      g.datetime
    LIMIT 5
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
  season: string,
  sport: Sport
): Promise<number[]> {
  try {
    const data = await sql<{ round: number }>`
      SELECT
        r.round_number AS round
      FROM
        rounds r
      WHERE
        r.sport = ${sport} AND r.season = ${season}
        ORDER BY
        r.round_number ASC
    `;

    // Extract round numbers from the fetched data
    const rounds = data.rows.map((item) => item.round);

    return rounds;
  } catch (err) {
    console.error("Database Error:", err);
    console.error(
      `Failed to fetch rounds for sport: ${sport}, season: ${season}`
    );
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

export async function fetchUserCompetitions(
  userId: string
): Promise<UserCompetitions> {
  const todays_date = getTodaysDate();
  try {
    const signedUpData = await sql<Competition>`
      SELECT c.id, c.name
      FROM competitions c
      WHERE c.id IN (
        SELECT uc.competition_id
        FROM user_competitions uc
        WHERE uc.user_id = ${userId}
      )
      AND ${todays_date} BETWEEN c.start_date AND c.end_date
    `;

    const notSignedUpData = await sql<Competition>`       SELECT c.id, c.name
      FROM competitions c
      WHERE c.id NOT IN (
        SELECT uc.competition_id
        FROM user_competitions uc
        WHERE uc.user_id = ${userId}
      )
      AND ${todays_date} BETWEEN c.start_date AND c.end_date
  `;

    const userCompetitions: UserCompetitions = {
      signedUp: signedUpData.rows,
      notSignedUp: notSignedUpData.rows,
    };

    return userCompetitions;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch user competitions.");
  }
}
