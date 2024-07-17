import { db } from "@vercel/postgres";
import { rounds } from "../../seed/rounds/data";

const client = await db.connect();

async function seedRounds() {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "rounds" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS rounds (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    season VARCHAR(255) NOT NULL,
    round_number VARCHAR(255) NOT NULL,
    sport VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp,
    updated_at TIMESTAMP DEFAULT current_timestamp
    );
    `;

    console.log(`Created "rounds" table`);

    // Insert data into the "rounds" table
    const insertedRounds = await Promise.all(
      rounds.map(async (round) => {
        return client.sql`
        INSERT INTO rounds (season, round_number, sport, start_date, end_date)
        VALUES (${round.season}, ${round.round}, ${round.sport}, ${round.start_date}, ${round.end_date})
        ON CONFLICT (sport, season, round_number) DO NOTHING;
      `;
      })
    );

    console.log(`Seeded ${insertedRounds.length} rounds`);

    return {
      createTable,
      rounds: insertedRounds,
    };
  } catch (error) {
    console.error("Error seeding round data. Error:", error);
  }
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedRounds();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
