import { Suspense } from "react";

import { Metadata } from "next";
import { UserHeading } from "../../components/dashboard/user-heading";
import DashboardCards from "../../components/dashboard/dashboard-cards";
import {
  getUserRegisteredCompetitions,
  getUserUnregisteredCompetitions,
} from "../../lib/competitions";
import {
  DashboardCardsSkeleton,
  UpcomingGamesSkeleton,
  UserHeadingSkeleton,
} from "@/components/skeletons";
import { UpcomingGamesLayout } from "@/components/dashboard/upcoming-games-layout";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of tipping results and upcoming games.",
  keywords: "overview, tipping, results, upcoming, games, dashboard",
};

export default async function Page() {
  const [registeredCompetitions, unregisteredCompetitions] = await Promise.all([
    getUserRegisteredCompetitions(),
    getUserUnregisteredCompetitions(),
  ]);

  return (
    <main>
      <Suspense fallback={<UserHeadingSkeleton />}>
        <UserHeading userSports={registeredCompetitions} />
      </Suspense>
      <Suspense fallback={<DashboardCardsSkeleton />}>
        <h2 className="mt-6 text-2xl font-bold tracking-tight md:text-3xl text-center">
          {registeredCompetitions.length > 0
            ? "Tipping results"
            : "Sports competitions"}
        </h2>
        <DashboardCards
          registeredSports={registeredCompetitions}
          unregisteredSports={unregisteredCompetitions}
        />
      </Suspense>
      <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<UpcomingGamesSkeleton />}>
          {registeredCompetitions.length > 0 && (
            <div className="col-span-1 md:col-span-4 lg:col-span-8">
              <UpcomingGamesLayout sports={registeredCompetitions} />
            </div>
          )}
        </Suspense>
      </div>
    </main>
  );
}
