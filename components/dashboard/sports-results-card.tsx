"use client";

import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import Link from "next/link";

type SportsResultsCardProps = {
  sport: string;
  round: {
    roundNumber: string;
    score: number;
    totalGames: number;
  };
  total: {
    score: number;
    ranking: number;
    totalUsers: number;
  };
};

const getOrdinalSuffix = (number: number) => {
  const j = number % 10,
    k = number % 100;
  if (j === 1 && k !== 11) {
    return number + "st";
  }
  if (j === 2 && k !== 12) {
    return number + "nd";
  }
  if (j === 3 && k !== 13) {
    return number + "rd";
  }
  return number + "th";
};

export const SportsResultsCard: React.FC<SportsResultsCardProps> = ({
  sport,
  round,
  total,
}) => {
  return (
    <Card className="w-full max-w-md rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle>{sport} results</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              Round {round.roundNumber} Score: {round.score}/{round.totalGames}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              Total Points: {total.score}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListOrderedIcon className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {getOrdinalSuffix(total.ranking)} of {total.totalUsers}
            </span>
          </div>
          <Link href={`/dashboard/leaderboard?sport=${sport}&page=1`}>
            <Button className="bg-blue-500 text-white hover:bg-blue-700 text-xs md:text-sm px-4 py-2">
              View leaderboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SportsResultsCard;

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

function ListOrderedIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="10" x2="21" y1="6" y2="6" />
      <line x1="10" x2="21" y1="12" y2="12" />
      <line x1="10" x2="21" y1="18" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
