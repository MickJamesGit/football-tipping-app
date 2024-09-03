import React from "react";
import { SportsResultsCard } from "./sports-results-card";
import { getOverallSummaryRanking } from "@/lib/rankings";
import { getLastRoundScores } from "@/lib/scores";
import { DashboardCarousel } from "../ui/dashboard-carousel";

interface DashboardCardsProps {
  registeredSports: string[];
}

async function DashboardCards({ registeredSports }: DashboardCardsProps) {
  const [lastRoundScores, overallRankings] = await Promise.all([
    getLastRoundScores(registeredSports),
    getOverallSummaryRanking(registeredSports),
  ]);

  const allItems = registeredSports.map((sport, index) =>
    sport ? (
      <SportsResultsCard
        key={`sport-${index}`}
        sport={sport}
        round={lastRoundScores[index]}
        total={overallRankings[index]}
      />
    ) : null
  );

  return (
    <div className="flex justify-center p-2">
      <DashboardCarousel sportsResults={allItems} />
    </div>
  );
}

export default DashboardCards;
