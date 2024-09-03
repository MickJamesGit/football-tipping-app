import React from "react";
import { SportsResultsCard } from "./sports-results-card";
import { SportsRegisterCard } from "./tipping/sports-register-card";
import { getOverallSummaryRanking } from "@/lib/rankings";
import { getLastRoundScores } from "@/lib/scores";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "@mui/material";
import { DashboardCarousel } from "../ui/dashboard-carousel";

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

async function DashboardCards({
  registeredSports,
  unregisteredSports,
}: DashboardCardsProps) {
  const [lastRoundScores, overallRankings] = await Promise.all([
    getLastRoundScores(registeredSports),
    getOverallSummaryRanking(registeredSports),
  ]);

  const allItems = [
    ...registeredSports.map((sport, index) =>
      sport ? (
        <SportsResultsCard
          key={`sport-${index}`}
          sport={sport}
          round={lastRoundScores[index]}
          total={overallRankings[index]}
        />
      ) : null
    ),
    ...unregisteredSports.map((competition) => (
      <SportsRegisterCard
        key={`competition-${competition.id}`}
        competition={competition}
      />
    )),
  ];

  return (
    <div className="flex justify-center p-2">
      <DashboardCarousel sportsResults={allItems} />
    </div>
  );
}

export default DashboardCards;
