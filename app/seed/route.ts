import { db } from "@vercel/postgres";
import { games } from "../lib/placeholder-data";

const client = await db.connect();

async function seedGames() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  try {
    await client.sql`
      CREATE TABLE IF NOT EXISTS games (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        sport VARCHAR(255) NOT NULL,
        round INT NOT NULL,
        home_team_id UUID NOT NULL,
        away_team_id UUID NOT NULL,
        venue VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        created_at TIMESTAMP DEFAULT current_timestamp,
        updated_at TIMESTAMP DEFAULT current_timestamp,
        FOREIGN KEY (home_team_id) REFERENCES teams(id),
        FOREIGN KEY (away_team_id) REFERENCES teams(id)
      );
    `;
    console.log('Table "games" created successfully or already exists.');
  } catch (error) {
    console.error('Error creating table "games":', error);
  }

  const insertedGames = await Promise.all(
    games.map((game) => {
      console.log(`
          INSERT INTO games (sport, round, home_team_id, away_team_id, venue, date, time)
          VALUES (${game.sport}, ${game.round}, ${game.home_team_id}, ${game.away_team_id}, ${game.venue}, ${game.date}, ${game.time});
        `);
      client.sql`
      INSERT INTO games (sport, round, home_team_id, away_team_id, venue, date, time)
      VALUES (${game.sport}, ${game.round}, ${game.home_team_id}, ${game.away_team_id}, ${game.venue}, ${game.date}, ${game.time});
    `;
    })
  );

  return insertedGames;
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
