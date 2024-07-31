import React from "react";
import { fetchLastRoundScores, fetchOverallRanking } from "@/app/lib/data";
import { SportsResultsCard } from "./sports-results-card";
import { SportsRegisterCard } from "./sports-register-card";

interface DashboardCardsProps {
  registeredSports: string[];
  unregisteredSports: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    userCount: number;
  }[];
}

const getGridCols = (length: number | null) => {
  if (length === 1) return "grid-cols-1";
  if (length === 2) return "grid-cols-1 lg:grid-cols-2";
  return "grid-cols-1 lg:grid-cols-3";
};

async function DashboardCards({
  registeredSports,
  unregisteredSports,
}: DashboardCardsProps) {
  const [lastRoundScores, overallRankings] = await Promise.all([
    fetchLastRoundScores(registeredSports),
    fetchOverallRanking(registeredSports),
  ]);

  const gridColsClass = getGridCols(overallRankings.length);

  return (
    <div className="flex justify-center p-4 pt-6">
      <div
        className={`grid gap-6 w-full max-w-7xl ${gridColsClass} justify-items-center`}
      >
        {registeredSports.map((sport, index) =>
          sport ? (
            <SportsResultsCard
              key={index}
              sport={sport}
              round={lastRoundScores[index]}
              total={overallRankings[index]}
            />
          ) : null
        )}
        {unregisteredSports.map((competition) => (
          <SportsRegisterCard key={competition.id} competition={competition} />
        ))}
      </div>
    </div>
  );
}

export default DashboardCards;
