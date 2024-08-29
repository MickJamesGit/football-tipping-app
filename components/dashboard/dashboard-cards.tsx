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
    <div className="flex justify-center p-4 ">
      <Carousel className="w-full max-w-xs sm:max-w-lg">
        <CarouselContent>
          {allItems.map((item, index) => (
            <CarouselItem key={index}>
              <div className="p-2">
                <Card className="shadow-lg border rounded-lg">
                  <CardContent>{item}</CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white" />
        <CarouselNext className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white" />
      </Carousel>
    </div>
  );
}

export default DashboardCards;
