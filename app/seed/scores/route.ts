import { db } from "@vercel/postgres";
// import { tips } from "../../lib/placeholder-data";

const client = await db.connect();

async function seedScores() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  try {
    await client.sql`
    CREATE TABLE IF NOT EXISTS scores (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL,
        sport VARCHAR(255) NOT NULL,
  season VARCHAR(255) NOT NULL,
  round VARCHAR(255) NOT NULL,
  score INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;
    console.log('Table "tips" created successfully or already exists.');
  } catch (error) {
    console.error('Error creating table "tips":', error);
  }

  // const insertedTips = await Promise.all(
  //   tips.map((tip) => {
  //     console.log(`
  //         INSERT INTO tips (user_id, tip_team_id, game_id, status)
  //         VALUES (${tip.user_id}, ${tip.tip_team_id}, ${tip.game_id}, 'pending');
  //       `);
  //     client.sql`
  //         INSERT INTO tips (user_id, tip_team_id, game_id, status)
  //         VALUES (${tip.user_id}, ${tip.tip_team_id}, ${tip.game_id}, 'pending');
  //   `;
  //   })
  // );

  return 1;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedScores();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
