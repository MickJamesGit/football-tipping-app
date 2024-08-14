import { Metadata } from "next";
import { Suspense } from "react";
import { SportsCompetitionLayoutSkeleton } from "@/app/ui/dashboard/skeletons";
import { SportsCompetitionsLayout } from "@/app/ui/dashboard/sports-competitions-layout";

export const metadata: Metadata = {
  title: "Tipping Competitions",
  description: "View or join tipping competitions.",
  keywords: "tipping, competitions, view, join",
};

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
      <Suspense fallback={<SportsCompetitionLayoutSkeleton />}>
        <SportsCompetitionsLayout />
      </Suspense>
    </div>
  );
}
