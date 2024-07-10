import { db } from "@vercel/postgres";

const client = await db.connect();

async function seedTeams() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  try {
    await client.sql`
      ALTER TABLE teams
ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    `;
    console.log("table updated.");
  } catch (error) {
    console.error("Error updating table:", error);
  }

  try {
    await client.sql`
      UPDATE teams
SET created_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL OR updated_at IS NULL;
    `;
    console.log('All existing tips set to "pending" status.');
  } catch (error) {
    console.error('Error updating existing tips to "pending" status:', error);
  }

  return 1;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedTeams();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
