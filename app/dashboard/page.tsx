import { Suspense } from "react";
import {
  DashboardCardsSkeleton,
  UpcomingGamesSkeleton,
  UserHeadingSkeleton,
} from "@/app/ui/dashboard/skeletons";
import { Metadata } from "next";
import { UserHeading } from "../ui/dashboard/user-heading";
import { fetchUserCompetitions } from "../lib/data";
import { UpcomingGamesLayout } from "../ui/dashboard/upcoming-games-layout";
import DashboardCards from "../ui/dashboard/dashboard-cards";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Page() {
  const { userCompetitions } = await fetchUserCompetitions();

  const registeredSports = userCompetitions.signedUp.map(
    (competition) => competition.name
  );

  return (
    <main>
      <Suspense fallback={<UserHeadingSkeleton />}>
        <UserHeading userSports={registeredSports} />
      </Suspense>
      <Suspense fallback={<DashboardCardsSkeleton />}>
        <DashboardCards
          registeredSports={registeredSports}
          unregisteredSports={userCompetitions.notSignedUp}
        />
      </Suspense>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<UpcomingGamesSkeleton />}>
          <div className="col-span-1 md:col-span-4 lg:col-span-8">
            <UpcomingGamesLayout sports={registeredSports} />
          </div>
        </Suspense>
      </div>
    </main>
  );
}
