import { db } from "@vercel/postgres";
import { competitions } from "./data";

const client = await db.connect();

async function seedCompetitions() {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "competitions" table if it doesn't exist
    const createTable = await client.sql`
     CREATE TABLE IF NOT EXISTS competitions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp,
    updated_at TIMESTAMP DEFAULT current_timestamp
    );
    `;

    console.log(`Created "competitions" table`);

    // Insert data into the "competitions" table
    const insertedCompetitions = await Promise.all(
      competitions.map(async (competition) => {
        return client.sql`
        INSERT INTO competitions (name, start_date, end_date)
        VALUES (${competition.name}, ${competition.start_date}, ${competition.end_date})
      `;
      })
    );

    console.log(`Seeded ${insertedCompetitions.length} competitions`);

    return {
      createTable,
      users: insertedCompetitions,
    };
  } catch (error) {
    console.error("Error seeding competition data. Error:", error);
  }
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedCompetitions();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
