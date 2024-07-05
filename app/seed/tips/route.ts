import { db } from "@vercel/postgres";
import { tips } from "../../lib/placeholder-data";

const client = await db.connect();

async function seedTips() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  try {
    await client.sql`
    CREATE TABLE IF NOT EXISTS tips (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      created_at TIMESTAMP DEFAULT current_timestamp,
      updated_at TIMESTAMP DEFAULT current_timestamp,
      FOREIGN KEY (home_team_id) REFERENCES teams(id),
      FOREIGN KEY (away_team_id) REFERENCES teams(id)
    );
  `;
    console.log('Table "tips" created successfully or already exists.');
  } catch (error) {
    console.error('Error creating table "tips":', error);
  }

  const insertedTips = await Promise.all(
    tips.map((tip) => {
      console.log(`
          INSERT INTO tips (user_id, tip_team_id, game_id)
          VALUES (${tip.user_id}, ${tip.tip_team_id}, ${tip.game_id});
        `);
      client.sql`
          INSERT INTO tips (user_id, tip_team_id, game_id)
          VALUES (${tip.user_id}, ${tip.tip_team_id}, ${tip.game_id});
    `;
    })
  );

  return insertedTips;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedTips();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
