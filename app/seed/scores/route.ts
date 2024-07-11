import { db } from "@vercel/postgres";
// import { tips } from "../../lib/placeholder-data";

const client = await db.connect();

interface Tip {
  user_id: string;
  game_id: string;
  status: "correct" | "incorrect";
}

interface Score {
  id: string;
  score: number;
}

function getRandomScore() {
  return Math.floor(Math.random() * 6); // Generate a random score between 0 and 5
}

async function seedScores() {
  try {
    // Fetch all users
    const res = await client.query("SELECT id FROM users");
    const users = res.rows;

    for (const user of users) {
      // Generate random scores for rounds 18 and 19
      const scoreRound18 = getRandomScore();
      const scoreRound19 = getRandomScore();
      const overallScore = scoreRound18 + scoreRound19;

      // Insert score for round 18
      await client.query(
        `INSERT INTO scores (user_id, sport, season, round, score, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [user.id, "NRL", "2024", "18", scoreRound18]
      );

      // Insert score for round 19
      await client.query(
        `INSERT INTO scores (user_id, sport, season, round, score, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [user.id, "NRL", "2024", "19", scoreRound19]
      );

      // Insert overall score
      await client.query(
        `INSERT INTO scores (user_id, sport, season, round, score, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [user.id, "NRL", "2024", "overall", overallScore]
      );
    }

    console.log("Scores seeded successfully.");
  } catch (err) {
    console.error("Database Error:", err);
  }
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedScores();
    await client.sql`COMMIT`;

    return new Response(
      JSON.stringify({ message: "Database seeded successfully" }),
      { status: 200 }
    );
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
