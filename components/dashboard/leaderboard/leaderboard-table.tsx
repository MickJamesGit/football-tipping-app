"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/table";
import { useDebouncedCallback } from "use-debounce";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LeaderboardEntry } from "@/types/definitions";
import PageHeading from "../page-heading";

export default function LeaderboardTable({
  sportsList,
  query,
  rankings,
  sport,
  previousRound,
}: {
  sportsList: string[];
  query: string;
  rankings: LeaderboardEntry[];
  sport: string;
  previousRound: string;
}) {
  const [search, setSearch] = useState(query || "");
  const [selectedSport, setSport] = useState(sport || "");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleSportChange = (sport: string) => {
    setSport(sport);

    const params = new URLSearchParams(searchParams);

    if (sport) {
      params.set("sport", sport);
      params.set("page", "1");
    } else {
      params.delete("sport");
      params.set("page", "1");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const leaderboard = useMemo(() => {
    return rankings.filter((user) => {
      const searchValue = search.toLowerCase();
      return user.alias.toLowerCase().includes(searchValue);
    });
  }, [search, rankings]);

  return (
    <div className="flex flex-col gap-2 container mx-auto py-4 px-4 md:px-6 bg-slate-50 rounded-lg">
      <PageHeading
        title="Leaderboard"
        description={`Overall rankings for the 2024 ${sport} tipping competition.`}
      />
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Search by username..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleSearch(e.target.value);
          }}
          className="w-full lg:max-w-[50%]"
        />
        <Select value={selectedSport} onValueChange={handleSportChange}>
          <SelectTrigger className="w-[40%] md:w-[150px]">
            <SelectValue placeholder="Filter by sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {sportsList.map((sportItem) => (
                <SelectItem key={sportItem} value={sportItem}>
                  {sportItem}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="p-2 bg-white rounded-lg border">
        <Table className="bg-white py-2 text-xs sm:text-sm">
          <TableHeader className="">
            <TableRow>
              <TableHead className="w-[10%] p-1 text-left">Rank</TableHead>
              <TableHead className="w-[40%] p-1 text-left">Username</TableHead>
              <TableHead className="w-[25%] p-1 text-right">
                R{previousRound}
              </TableHead>
              <TableHead className="w-[25%] p-1 text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <tr className="h-2"></tr>
          <TableBody className="">
            {leaderboard.map((ranking) => (
              <TableRow key={ranking.id} className="text-xs md:text-sm ">
                <TableCell className="w-[10%] p-1 text-left font-medium">
                  {ranking.ranking}
                </TableCell>
                <TableCell className="w-[40%] p-1 text-left">
                  {ranking.ranking <= 3 ? (
                    <div className="flex items-center gap-1">
                      <MedalIcon
                        className={`w-4 h-4 fill-${
                          ranking.ranking === 1
                            ? "[#FFD700]"
                            : ranking.ranking === 2
                              ? "[#C0C0C0]"
                              : "[#CD7F32]"
                        }`}
                      />
                      {ranking.alias}
                    </div>
                  ) : (
                    ranking.alias
                  )}
                </TableCell>
                <TableCell className="w-[25%] p-1 text-right">
                  {ranking.previous_round_points}
                </TableCell>
                <TableCell className="w-[25%] p-1 text-right">
                  {ranking.total_points}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function MedalIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
      <path d="M11 12 5.12 2.2" />
      <path d="m13 12 5.88-9.8" />
      <path d="M8 7h8" />
      <circle cx="12" cy="17" r="5" />
      <path d="M12 18v-2h-.5" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
