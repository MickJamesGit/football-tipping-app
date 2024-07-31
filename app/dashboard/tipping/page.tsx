import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tipping",
};

import { Suspense } from "react";
import { CompetitionsSkeleton } from "@/app/ui/dashboard/skeletons";
import { SportsCompetitionsLayout } from "@/app/ui/dashboard/sports-competitions-layout";

export type Competition = {
  id: string;
  name: string;
};

export type UserCompetitions = {
  signedUp: Competition[];
  notSignedUp: Competition[];
};

export default async function Page() {
  return (
    <div className="w-full space-y-8">
      <Suspense fallback={<CompetitionsSkeleton />}>
        <SportsCompetitionsLayout />
      </Suspense>
    </div>
  );
}
