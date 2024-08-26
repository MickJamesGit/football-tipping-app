import { seedDatabase } from "@/lib/seeding";

export default async function Page() {
  await seedDatabase();

  return (
    <div>
      <p>Database seeding complete!</p>
    </div>
  );
}
