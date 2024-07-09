import { db } from "@vercel/postgres";
// import { tips } from "../../lib/placeholder-data";

const client = await db.connect();

async function seedTips() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  try {
    await client.sql`
    CREATE TABLE IF NOT EXISTS tips (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL,
      game_id UUID NOT NULL,
      tip_team_id UUID NOT NULL,
      status VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT current_timestamp,
      updated_at TIMESTAMP DEFAULT current_timestamp,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (game_id) REFERENCES games(id),
      FOREIGN KEY (tip_team_id) REFERENCES teams(id)
    );
  `;
    console.log('Table "tips" created successfully or already exists.');
  } catch (error) {
    console.error('Error creating table "tips":', error);
  }

  try {
    await client.sql`
      ALTER TABLE tips
      ADD COLUMN IF NOT EXISTS status VARCHAR(255) NOT NULL DEFAULT 'pending';
    `;
    console.log('Column "status" added successfully or already exists.');
  } catch (error) {
    console.error('Error adding column "status":', error);
  }

  try {
    await client.sql`
      UPDATE tips
      SET status = 'pending'
      WHERE status IS NULL;
    `;
    console.log('All existing tips set to "pending" status.');
  } catch (error) {
    console.error('Error updating existing tips to "pending" status:', error);
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
    await seedTips();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
