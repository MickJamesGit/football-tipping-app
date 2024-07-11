import { db } from "@vercel/postgres";
import { users } from "../../lib/placeholder-data";
const bcrypt = require("bcrypt");

const client = await db.connect();

function generateAlias() {
  const adjectives = ["Fast", "Red", "Cool", "Silent", "Brave"];
  const nouns = ["Panther", "Eagle", "Lion", "Wolf", "Tiger"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}${noun}${Math.floor(Math.random() * 1000)}`;
}

async function seedUsers() {
  try {
    const res = await client.query("SELECT id FROM users");
    const users = res.rows;

    for (const user of users) {
      const alias = generateAlias();
      await client.query("UPDATE users SET alias = $1 WHERE id = $2", [
        alias,
        user.id,
      ]);
    }

    return 1;
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
