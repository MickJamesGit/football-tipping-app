"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoundPagination({
  allRounds,
  initialRound,
}: {
  allRounds: number[];
  initialRound: number;
}) {
  const totalRounds = allRounds.length;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentRound = Number(searchParams.get("round")) || initialRound;

  useEffect(() => {
    if (!searchParams.get("round")) {
      const params = new URLSearchParams(searchParams);
      params.set("round", initialRound.toString());
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [initialRound, pathname, router, searchParams]);

  const handleRoundChange = (e: { target: { value: any } }) => {
    const selectedRound = parseInt(e.target.value, 10);
    const params = new URLSearchParams(searchParams);
    params.set("round", selectedRound.toString());
    router.push(`?${params.toString()}`);
  };

  const createRoundURL = (roundNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("round", roundNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <>
      <div className="inline-flex">
        <PaginationArrow
          direction="left"
          href={createRoundURL(currentRound - 1)}
          isDisabled={currentRound <= 1}
        />

        <form method="GET">
          <select
            id="round-select"
            name="round"
            value={currentRound}
            className="flex -space-x-px h-10 w-25 items-center justify-center text-sm border rounded-md bg-white border-gray-300 text-black"
            onChange={handleRoundChange}
          >
            {allRounds.map((round) => (
              <option
                key={round}
                value={round}
                className="p-2 bg-white text-black hover:bg-gray-100"
              >
                Round {round}
              </option>
            ))}
          </select>
        </form>

        <PaginationArrow
          direction="right"
          href={createRoundURL(currentRound + 1)}
          isDisabled={currentRound >= totalRounds}
        />
      </div>
    </>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
}) {
  const className = clsx(
    "flex h-10 w-10 items-center justify-center rounded-md border border-gray-300",
    {
      "pointer-events-none text-gray-300": isDisabled,
      "hover:bg-gray-100": !isDisabled,
      "mr-2 md:mr-4": direction === "left",
      "ml-2 md:ml-4": direction === "right",
    }
  );

  const icon =
    direction === "left" ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}
