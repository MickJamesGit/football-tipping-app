import { db } from "@vercel/postgres";
import { teams } from "../../seed/teams/data";

const client = await db.connect();

async function seedTeams() {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "teams" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sport VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp,
    updated_at TIMESTAMP DEFAULT current_timestamp
    );
    `;

    console.log(`Created "teams" table`);

    // Insert data into the "teams" table
    const insertedTeams = await Promise.all(
      teams.map(async (team) => {
        return client.sql`
        INSERT INTO teams (name, sport)
        VALUES (${team.name}, ${team.sport})
        ON CONFLICT (name) DO NOTHING;
      `;
      })
    );

    console.log(`Seeded ${insertedTeams.length} teams`);

    return {
      createTable,
      teams: insertedTeams,
    };
  } catch (error) {
    console.error("Error seeding team data. Error:", error);
  }
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
