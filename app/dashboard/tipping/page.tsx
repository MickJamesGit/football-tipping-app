import { SportsCompetitionsLayout } from "@/components/dashboard/tipping/sports-competitions-layout";
import { SportsCompetitionLayoutSkeleton } from "@/components/skeletons";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tipping Competitions",
  description: "View or join tipping competitions.",
  keywords: "tipping, competitions, view, join",
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
