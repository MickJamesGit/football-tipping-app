"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function RoundSelector({
  currentRound,
}: {
  currentRound: number;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleRoundChange = (e) => {
    const selectedRound = e.target.value;
    const params = new URLSearchParams(searchParams);
    params.set("round", selectedRound);
    router.push(`?${params.toString()}`);
  };

  return (
    <form method="GET">
      <label htmlFor="round-select">Select Round: </label>
      <select
        id="round-select"
        name="round"
        value={currentRound}
        className="ml-2 p-2 text-lg border border-gray-300 rounded w-32"
        onChange={handleRoundChange}
      >
        {[...Array(25)].map((_, i) => (
          <option key={i} value={i + 1}>
            Round {i + 1}
          </option>
        ))}
      </select>
    </form>
  );
}
