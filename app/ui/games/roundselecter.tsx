"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function RoundSelector({
  currentRound,
}: {
  currentRound: number;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleRoundChange = (e: { target: { value: any } }) => {
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
        className="p-3 text-lg border border-gray-300 bg-white text-black rounded-l-lg focus:outline-none border-r-0"
        disabled={currentRound <= 1}
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
          {[...Array(25)].map((_, i) => (
            <option
              key={i}
              value={i + 1}
              className="p-2 bg-white text-black hover:bg-gray-100"
            >
              Round {i + 1}
            </option>
          ))}
        </select>
      </form>
      <button
        onClick={handleNextRound}
        className="p-3 text-lg border border-gray-300 bg-white text-black rounded-r-lg focus:outline-none border-l-0"
        disabled={currentRound >= 25}
      >
        &rarr;
      </button>
    </div>
  );
}
``;
