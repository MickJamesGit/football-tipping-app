import { db } from "@vercel/postgres";
import { rankings } from "../../lib/placeholder-data";

const client = await db.connect();

async function seedRankings() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  try {
    await client.sql`
    CREATE TABLE IF NOT EXISTS rankings (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_name VARCHAR(255) NOT NULL,
      round VARCHAR(255) NOT NULL,
      ranking INT NOT NULL,
      total_points INT NOT NULL,
      created_at TIMESTAMP DEFAULT current_timestamp,
      updated_at TIMESTAMP DEFAULT current_timestamp
    );
  `;
    console.log('Table "rankings" created successfully or already exists.');
  } catch (error) {
    console.error('Error creating table "rankings":', error);
  }

  const insertedRankings = await Promise.all(
    rankings.map((ranking) => {
      console.log(`
          INSERT INTO rankings (user_name, round, ranking, total_points)
          VALUES (${ranking.user_name}, ${ranking.round}, ${ranking.ranking}, ${ranking.total_points});
        `);
      client.sql`
          INSERT INTO rankings (user_name, round, ranking, total_points)
          VALUES (${ranking.user_name}, ${ranking.round}, ${ranking.ranking}, ${ranking.total_points});
    `;
    })
  );

  return insertedRankings;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedRankings();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
