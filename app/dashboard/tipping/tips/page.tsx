import { Suspense } from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";
import { TippingTableSkeleton } from "@/components/skeletons";
import TippingTableLayout from "@/components/dashboard/tipping/tips/tipping-table-layout";

export const metadata: Metadata = {
  title: "Tips",
  description: "Submit or update tips for each round.",
  keywords: "tips, games, submit, update",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    round?: string;
    sport?: string;
  };
}) {
  const sport = searchParams?.sport || redirect("/dashboard/tipping");
  const round = searchParams?.round || redirect("/dashboard/tipping");

  return (
    <div className="w-full space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/tipping">
              Sports Competitions
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tips</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Suspense fallback={<TippingTableSkeleton />}>
        <TippingTableLayout sport={sport} round={round} />
      </Suspense>
    </div>
  );
}
