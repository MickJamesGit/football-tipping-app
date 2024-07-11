import { sql } from "@vercel/postgres";
import {
  Teams,
  Games,
  Tips,
  Rounds,
  Sport,
  LeaderboardEntry,
} from "./definitions";

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

    console.log(totalCount);
    console.log(totalPages);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of users with scores.");
  }
}

export async function fetchTeams() {
  try {
    const data = await sql<Teams>`
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
    const data = await sql<Games>`
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
    const filteredData = rankedData.filter((entry) =>
      entry.alias.toLowerCase().includes(query.toLowerCase())
    );

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
): Promise<Rounds["round"]> {
  try {
    const data = await sql<Rounds>`
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
): Promise<Rounds["round"]> {
  try {
    const data = await sql<Rounds>`
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
