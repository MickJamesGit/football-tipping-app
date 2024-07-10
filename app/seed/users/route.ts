import { db } from "@vercel/postgres";

const client = await db.connect();

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  try {
    await client.sql`
      ALTER TABLE users
      ADD COLUMN alias VARCHAR(255),
      ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    `;
    console.log("table updated.");
  } catch (error) {
    console.error("Error updating table:", error);
  }

  try {
    await client.sql`
      UPDATE users
SET alias = 'DefaultUser123',
    created_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE alias IS NULL;
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
    await seedUsers();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
