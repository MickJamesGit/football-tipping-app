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
import PageHeading from "@/components/dashboard/page-heading";

export const metadata: Metadata = {
  title: "Tips",
  description: "Submit or update tips for each round.",
  keywords: "tips, games, submit, update",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    round?: string;
    sport?: string;
  }>;
}) {
  const params = await searchParams;

  const sport = params?.sport;
  const round = params?.round;

  if (!sport || !round) {
    redirect("/dashboard/tipping");
  }
  
  return (
    <div className="w-full space-y-8">
      <Suspense fallback={<TippingTableSkeleton />}>
        <TippingTableLayout sport={sport} round={round} />
      </Suspense>
    </div>
  );
}
