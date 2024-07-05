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

  const handlePreviousRound = () => {
    if (currentRound > 1) {
      const params = new URLSearchParams(searchParams);
      params.set("round", (currentRound - 1).toString());
      router.push(`?${params.toString()}`);
    }
  };

  const handleNextRound = () => {
    if (currentRound < 25) {
      const params = new URLSearchParams(searchParams);
      params.set("round", (currentRound + 1).toString());
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <button
        onClick={handlePreviousRound}
        className="p-2 text-lg border border-gray-300 bg-gray-100 text-black rounded-l-lg"
        disabled={currentRound <= 1}
      >
        &larr;
      </button>
      <form method="GET">
        <select
          id="round-select"
          name="round"
          value={currentRound}
          className="p-2 text-lg border-t border-b border-gray-300 bg-gray-100 text-black w-32 appearance-none"
          onChange={handleRoundChange}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
          }}
        >
          {[...Array(25)].map((_, i) => (
            <option key={i} value={i + 1}>
              Round {i + 1}
            </option>
          ))}
        </select>
      </form>
      <button
        onClick={handleNextRound}
        className="p-2 text-lg border border-gray-300 bg-gray-100 text-black rounded-r-lg"
        disabled={currentRound >= 25}
      >
        &rarr;
      </button>
    </div>
  );
}
``;
