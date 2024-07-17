import { db } from "@vercel/postgres";
import { games } from "../../seed/games/data";

const client = await db.connect();

async function getTeamId(teamName: string) {
  const result =
    await client.sql`SELECT id FROM teams WHERE name = ${teamName}`;
  if (result.rows.length > 0) {
    return result.rows[0].id;
  } else {
    throw new Error(`Team ID not found for team name: ${teamName}`);
  }
}

async function seedGames() {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "games" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS games (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      season VARCHAR(255) NOT NULL,
      round VARCHAR(255) NOT NULL,
      sport VARCHAR(255) NOT NULL,
      venue VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL,
      datetime TIMESTAMP NOT NULL,
      home_team_id UUID,
      away_team_id UUID,
      winning_team_id UUID,
      created_at TIMESTAMP DEFAULT current_timestamp,
      updated_at TIMESTAMP DEFAULT current_timestamp
    );
    `;

    console.log(`Created "games" table`);

    // Insert data into the "games" table
    const insertedGames = await Promise.all(
      games.map(async (game) => {
        const homeTeamId = await getTeamId(game.home_team_name);
        const awayTeamId = await getTeamId(game.away_team_name);

        return client.sql`
        INSERT INTO games (sport, round, home_team_id, away_team_id, venue, datetime, season, winning_team_id, status)
        VALUES (${game.sport}, ${game.round}, ${homeTeamId}, ${awayTeamId}, ${game.venue}, ${game.datetime}, ${game.season}, ${game.winning_team_id}, ${game.status})
        ON CONFLICT (sport, season, round, home_team_id, away_team_id) DO NOTHING;
      `;
      })
    );

    console.log(`Seeded ${insertedGames.length} GAMES`);

    return {
      createTable,
      games: insertedGames,
    };
  } catch (error) {
    console.error("Error seeding game data. Error:", error);
  }
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedGames();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
