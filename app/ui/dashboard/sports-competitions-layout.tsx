import React from "react";
import {
  fetchLastRoundScores,
  fetchNextGameDates,
  fetchUserCompetitions,
} from "@/app/lib/data";
import { SportsRegisterCard } from "./sports-register-card";
import { SubmitTipsCard } from "./submit-tips-card";

export async function SportsCompetitionsLayout() {
  const { userCompetitions } = await fetchUserCompetitions();
  const registeredCompetitions = userCompetitions.signedUp.map(
    (competitions) => competitions.name
  );

  const [lastRoundScores, nextGameDates] = await Promise.all([
    fetchLastRoundScores(registeredCompetitions),
    fetchNextGameDates(registeredCompetitions),
  ]);

  // Assuming the order of scores and dates matches the order of registeredCompetitions
  const combinedData = userCompetitions.signedUp.map((competition, index) => ({
    ...competition,
    lastRoundScore: lastRoundScores[index],
    nextGameDate: nextGameDates[index].nextGameDate,
    nextGameRound: nextGameDates[index].nextGameRound,
  }));

  return (
    <div className="w-full">
      {userCompetitions.signedUp.length > 0 && (
        <>
          <h1 className="bg-primary py-4 px-6 rounded-lg text-2xl font-bold text-primary-foreground">
            My Sports
          </h1>

          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            {combinedData.map((data) => (
              <SubmitTipsCard
                key={data.id}
                sport={data.name}
                previousRoundSummary={data.lastRoundScore}
                nextGameDate={data.nextGameDate}
                nextGameRound={data.nextGameRound}
              />
            ))}
          </div>
        </>
      )}
      {userCompetitions.signedUp.length === 0 && (
        <>
          <h1 className="bg-primary py-4 my-5 px-6 rounded-lg text-2xl font-bold text-primary-foreground">
            Join Competition
          </h1>
          <div className="flex flex-wrap gap-4 mt-6 mb-6 justify-center">
            {userCompetitions.notSignedUp.map((competition) => (
              <SportsRegisterCard
                key={competition.id}
                competition={competition}
              />
            ))}
          </div>
        </>
      )}
      {userCompetitions.signedUp.length > 0 &&
        userCompetitions.notSignedUp.length > 0 && (
          <>
            <h1 className="bg-primary py-4 my-5 px-6 rounded-lg text-2xl font-bold text-primary-foreground">
              Other Sports
            </h1>
            <div className="flex flex-wrap gap-4 mt-6 mb-6 justify-center">
              {userCompetitions.notSignedUp.map((competition) => (
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
