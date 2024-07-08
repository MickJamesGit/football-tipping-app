"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sport } from "@/app/lib/definitions";

const sports: Sport[] = ["NRL", "AFL"];

export default function SportSelector({
  currentSport,
}: {
  currentSport: Sport;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSport = e.target.value;
    const params = new URLSearchParams(searchParams);
    params.set("sport", selectedSport);
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      id="sport-select"
      name="sport"
      value={currentSport}
      className="p-2 text-lg border border-gray-300 bg-gray-100 text-black rounded-lg appearance-none w-40"
      onChange={handleSportChange}
      style={{
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
      }}
    >
      {sports.map((sport) => (
        <option key={sport} value={sport}>
          {sport}
        </option>
      ))}
    </select>
  );
}
