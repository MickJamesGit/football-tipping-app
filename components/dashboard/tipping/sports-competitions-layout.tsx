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
    },
  );

  return (
    <div className="container mx-auto py-4 pb-4 mb-6 bg-slate-50 rounded-lg px-4 md:px-6">
      {registeredCompetitions.length > 0 && (
        <>
          <PageHeading
            title="My Sports"
            description="Choose a sport to submit your tips for the upcoming games."
          />
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-4 justify-center">
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
      {unRegisteredCompetitions.length > 0 && (
        <>
          <div className="pt-6">
            <PageHeading
              title="Other Sports"
              description="Register to start tipping for any of the sports listed below."
            />
            <Separator className="my-4" />
            <div className="flex flex-wrap gap-4 justify-center">
              {unRegisteredCompetitions.map((competition) => (
                <SportsRegisterCard
                  key={competition.id}
                  competition={competition}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
