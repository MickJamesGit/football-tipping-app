import { db } from "@vercel/postgres";
import { rounds } from "../../lib/placeholder-data";

const client = await db.connect();

async function seedRounds() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  try {
    await client.sql`
    CREATE TABLE IF NOT EXISTS rounds (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sport VARCHAR(50) NOT NULL,
    round_number INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT current_timestamp,
      updated_at TIMESTAMP DEFAULT current_timestamp
    );
  `;
    console.log('Table "rounds" created successfully or already exists.');
  } catch (error) {
    console.error('Error creating table "rounds":', error);
  }

  const insertedRounds = await Promise.all(
    rounds.map((round) => {
      console.log(`
          INSERT INTO rounds (sport, round_number, start_date, end_date)
          VALUES (${round.sport}, ${round.round}, ${round.start_date}, ${round.end_date});
        `);
      client.sql`
          INSERT INTO rounds (sport, round_number, start_date, end_date)
          VALUES (${round.sport}, ${round.round}, ${round.start_date}, ${round.end_date});
    `;
    })
  );

  return insertedRounds;
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
