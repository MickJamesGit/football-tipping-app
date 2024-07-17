"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function RoundSelector({
  currentRound,
  allRounds,
}: {
  currentRound: number;
  allRounds: number[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleRoundChange = (e: { target: { value: any } }) => {
    const selectedRound = parseInt(e.target.value, 10);
    const params = new URLSearchParams(searchParams);
    params.set("round", selectedRound.toString());
    router.push(`?${params.toString()}`);
  };

  const handlePreviousRound = () => {
    const minRound = Math.min(...allRounds);
    if (currentRound > minRound) {
      const newRound = currentRound - 1;
      const params = new URLSearchParams(searchParams);
      params.set("round", newRound.toString());
      router.push(`?${params.toString()}`);
    }
  };

  const handleNextRound = () => {
    const maxRound = Math.max(...allRounds);
    if (currentRound < maxRound) {
      const newRound = currentRound + 1;
      const params = new URLSearchParams(searchParams);
      params.set("round", newRound.toString());
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <button
        onClick={handlePreviousRound}
        className="p-3 text-lg border border-gray-300 bg-white text-black rounded-l-lg focus:outline-none border-r-0"
        disabled={currentRound <= Math.min(...allRounds)}
      >
        &larr;
      </button>
      <form method="GET">
        <select
          id="round-select"
          name="round"
          value={currentRound}
          className="p-3 text-lg border-t border-b border-gray-300 bg-white text-black w-28 border-l-0 border-r-0 text-center focus:outline-none focus:ring-0 focus:border-gray-300"
          onChange={handleRoundChange}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            backgroundImage: "none",
          }}
        >
          {allRounds.map((round) => (
            <option
              key={round}
              value={round}
              className="p-2 bg-white text-black hover:bg-gray-100"
            >
              Round {round}
            </option>
          ))}
        </select>
      </form>
      <button
        onClick={handleNextRound}
        className="p-3 text-lg border border-gray-300 bg-white text-black rounded-r-lg focus:outline-none border-l-0"
        disabled={currentRound >= Math.max(...allRounds)}
      >
        &rarr;
      </button>
    </div>
  );
}
