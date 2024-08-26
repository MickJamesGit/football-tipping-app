"use client";

import { updateUserCompetitions } from "@/lib/competitions";
import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { format } from "date-fns";

type SportsRegisterCardProps = {
  competition: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    userCount: number;
  };
};

export const SportsRegisterCard: React.FC<SportsRegisterCardProps> = ({
  competition,
}) => {
  const startDate = new Date(competition.startDate);
  const endDate = new Date(competition.endDate);

  const formattedStartDate = format(startDate, "MMM yyyy");
  const formattedEndDate = format(endDate, "MMM yyyy");

  const updateUserCompetitionsWithId = updateUserCompetitions.bind(
    null,
    competition.id
  );
  return (
    <Card className="w-full max-w-md rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle>{competition.name}</CardTitle>
          <CardDescription>
            Join the {competition.name} tipping competition for the 2024 season.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {competition.userCount} users registered
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formattedStartDate} - {formattedEndDate}
            </span>
          </div>
          <form action={updateUserCompetitionsWithId}>
            <Button className="bg-blue-500 text-white hover:bg-blue-700">
              Register
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
