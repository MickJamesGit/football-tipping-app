import { db } from "@vercel/postgres";
import { games } from "../../lib/placeholder-data";

const client = await db.connect();

async function seedGames() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  try {
    await client.sql`
    -- Add the new season column to the games table
ALTER TABLE games
ADD COLUMN season VARCHAR(255);

-- Set the season to '2024' for all existing records
UPDATE games
SET season = '2024'
WHERE season IS NULL;

-- Update the datetime values to be 12 hours later
UPDATE games
SET datetime = datetime + INTERVAL '12 hours';

  `;
    console.log('Table "games" created successfully or already exists.');
  } catch (error) {
    console.error('Error creating table "games":', error);
  }

  return 1;
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
