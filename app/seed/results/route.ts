import { db } from "@vercel/postgres";

const client = await db.connect();

async function seedUpdateTipStatus(gameResults: any) {
  try {
    for (const result of gameResults) {
      const { gameId, winningTeamIds } = result;

      // Update tips with correct status
      await client.query(
        `UPDATE tips
         SET status = 'correct'
         WHERE game_id = $1 AND tip_team_id = ANY($2::uuid[])`,
        [gameId, winningTeamIds]
      );

      // Update tips with incorrect status
      await client.query(
        `UPDATE tips
         SET status = 'incorrect'
         WHERE game_id = $1 AND tip_team_id != ALL($2::uuid[])`,
        [gameId, winningTeamIds]
      );
    }

    console.log("Tip statuses updated successfully.");
  } catch (error) {
    console.error("Error updating tip statuses:", error);
  }
}

// Example usage:
// Define your game results
const gameResults: any = [
  {
    gameId: "2a877449-6a94-44a5-836b-1ef579f15c7f",
    winningTeamIds: ["8be87234-4a55-4985-8830-e0d393318f50"],
  },
  {
    gameId: "be8ccf7d-8702-4ccb-936f-2ea6cd5804e3",
    winningTeamIds: [
      "e972ab82-df78-46d4-92cb-4715c149f81e",
      "b20217fc-ee8e-4dae-8e5c-2e3f11c50ac6",
    ], // Example of a draw
  },
];

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUpdateTipStatus(gameResults);
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
