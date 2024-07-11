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
      className="p-3 text-lg border border-gray-300 bg-white text-black rounded-lg w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
      onChange={handleSportChange}
    >
      {sports.map((sport) => (
        <option
          key={sport}
          value={sport}
          className="p-2 bg-white text-black hover:bg-gray-100"
        >
          {sport}
        </option>
      ))}
    </select>
  );
}
