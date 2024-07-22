import { db } from "@vercel/postgres";
import { userCompetitions } from "./data";

const client = await db.connect();

async function seedUserCompetitions() {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "user-competitions" table if it doesn't exist
    const createTable = await client.sql`
     CREATE TABLE IF NOT EXISTS user_competitions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    competition_id VARCHAR(255) NOT NULL,
    signup_date TIMESTAMP DEFAULT current_timestamp,
    created_at TIMESTAMP DEFAULT current_timestamp,
    updated_at TIMESTAMP DEFAULT current_timestamp
    );
    `;

    console.log(`Created "user_competitions" table`);

    // Insert data into the "user-competitions" table
    const insertedUserCompetitions = await Promise.all(
      userCompetitions.map(async (competition) => {
        return client.sql`
        INSERT INTO user_competitions (user_id, competition_id)
        VALUES (${competition.user_id}, ${competition.competition_id})
      `;
      })
    );

    console.log(`Seeded ${insertedUserCompetitions.length} user competitions`);

    return {
      createTable,
      usersCompetitions: insertedUserCompetitions,
    };
  } catch (error) {
    console.error("Error seeding user competition data. Error:", error);
  }
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUserCompetitions();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
