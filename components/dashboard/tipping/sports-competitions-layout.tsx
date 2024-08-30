import React from "react";
import { SportsRegisterCard } from "./sports-register-card";
import { SubmitTipsCard } from "./submit-tips-card";
import {
  getUserRegisteredCompetitions,
  getUserUnregisteredCompetitions,
} from "@/lib/competitions";
import { getLastRoundScores } from "@/lib/scores";
import { getNextGameDatesBySports } from "@/lib/games";
import PageHeading from "../page-heading";
import { Separator } from "@radix-ui/react-select";

export async function SportsCompetitionsLayout() {
  const [registeredCompetitions, unRegisteredCompetitions] = await Promise.all([
    getUserRegisteredCompetitions(),
    getUserUnregisteredCompetitions(),
  ]);

  const [lastRoundScores, nextGameDates] = await Promise.all([
    getLastRoundScores(registeredCompetitions),
    getNextGameDatesBySports(registeredCompetitions),
  ]);

  const registeredCompetitionsSummary = registeredCompetitions.map(
    (competitionName, index) => {
      return {
        name: competitionName,
        lastRoundScore: lastRoundScores[index] || {},
        nextGameDate: nextGameDates[index]?.nextGameDate || "No upcoming games",
        nextGameRound: nextGameDates[index]?.nextGameRound || "N/A",
      };
    }
  );

  return (
    <div className="w-full space-y-4">
      {registeredCompetitions.length > 0 && (
        <>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-3xl">
              My sports
            </h1>
            <p className="text-base text-muted-foreground">
              {" "}
              Submit your tips for upcoming rounds.
            </p>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            {registeredCompetitionsSummary.map((data) => (
              <SubmitTipsCard
                key={data.name}
                sport={data.name}
                previousRoundSummary={data.lastRoundScore}
                nextGameDate={data.nextGameDate}
                nextGameRound={data.nextGameRound}
              />
            ))}
          </div>
        </>
      )}
      {registeredCompetitions.length === 0 && (
        <>
          <PageHeading title="Join a competition" />
          <div className="flex flex-wrap gap-4 mt-6 mb-6 justify-center">
            {unRegisteredCompetitions.map((competition) => (
              <SportsRegisterCard
                key={competition.id}
                competition={competition}
              />
            ))}
          </div>
        </>
      )}
      {registeredCompetitions.length > 0 &&
        unRegisteredCompetitions.length > 0 && (
          <>
            <PageHeading title="Other sports" />
            <div className="flex flex-wrap gap-4 mt-6 mb-6 justify-center">
              {unRegisteredCompetitions.map((competition) => (
                <SportsRegisterCard
                  key={competition.id}
                  competition={competition}
                />
              ))}
            </div>
          </>
        )}
    </div>
  );
}
