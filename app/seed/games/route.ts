import { db } from "@vercel/postgres";
import { games } from "../../lib/placeholder-data";

const client = await db.connect();

async function seedGames() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  try {
    await client.sql`
-- Add the new status column to the games table
ALTER TABLE games
ADD COLUMN status VARCHAR(255);

-- Set the status to 'upcoming' for all existing games
UPDATE games
SET status = 'upcoming';

-- Set the status to 'completed' for games where Winning_Team_Id is not NULL
UPDATE games
SET status = 'completed'
WHERE Winning_Team_Id IS NOT NULL;

-- Set the status of one specific game to 'inprogress'
UPDATE games
SET status = 'inprogress'
WHERE id = '6b5370b3-c616-46cf-8dbe-d81d7673420e';  -- Replace with the actual game ID


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
