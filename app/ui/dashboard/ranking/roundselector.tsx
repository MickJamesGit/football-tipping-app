"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoundSelector({
  currentRound,
}: {
  currentRound: number | string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedRound, setSelectedRound] = useState<string | number>(
    currentRound
  );

  useEffect(() => {
    setSelectedRound(currentRound);
  }, [currentRound]);

  const handleRoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedRound(selectedValue);
    const params = new URLSearchParams(searchParams);
    params.set("round", selectedValue);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <form method="GET">
        <select
          id="round-select"
          name="round"
          value={selectedRound}
          className="p-2 text-lg border-t border-b border-gray-300 bg-gray-100 text-black w-32 appearance-none"
          onChange={handleRoundChange}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
          }}
        >
          <option value="Overall">Overall</option>
          {[...Array(25)].map((_, i) => (
            <option key={i} value={i + 1}>
              Round {i + 1}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
}
