import { Suspense } from "react";

import { Metadata } from "next";
import { TippingTableSkeleton } from "@/app/ui/dashboard/skeletons";
import { redirect } from "next/navigation";
import TippingTableLayout from "@/app/ui/dashboard/tipping-table-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Tips",
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
