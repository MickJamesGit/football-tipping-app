"use client";

import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import Link from "next/link";
import { CountdownTimer } from "../../countdown-timer";

type SubmitTipCardProps = {
  sport: string;
  previousRoundSummary: {
    roundNumber: string;
    score: number;
    totalGames: number;
  };
  nextGameDate: string;
  nextGameRound: string;
};

export const SubmitTipsCard: React.FC<SubmitTipCardProps> = ({
  sport,
  previousRoundSummary,
  nextGameDate,
  nextGameRound,
}) => {
  return (
    <Card className="w-full max-w-md rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle>{sport}</CardTitle>
          <CardDescription>
            Submit your tips for the next round of the 2024 {sport} competition.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              Round {previousRoundSummary.roundNumber} score:{" "}
              {previousRoundSummary.score}/{previousRoundSummary.totalGames}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              Next Game: <CountdownTimer targetDate={new Date(nextGameDate)} />
            </span>
          </div>
          <Link
            href={`/dashboard/tipping/tips?sport=${sport}&round=${nextGameRound}`}
          >
            <Button className="bg-blue-500 text-white hover:bg-blue-700">
              Submit Tips
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
