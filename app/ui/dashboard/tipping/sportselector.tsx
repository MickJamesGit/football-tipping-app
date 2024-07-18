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
      className="flex -space-x-px h-10 w-25 items-center justify-center text-sm border rounded-md bg-white border-gray-300 text-black"
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
