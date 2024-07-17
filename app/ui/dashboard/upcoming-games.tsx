"use client";

import clsx from "clsx";
import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";
import { Game } from "@/app/lib/definitions";
import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: Date;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  function calculateTimeLeft(targetDate: Date) {
    const difference = targetDate.getTime() - new Date().getTime();

    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  return (
    <div className="flex flex-row md:flex-col md:items-end text-gray-600 md:text-gray-400">
      <div className="text-left text-sm md:text-base">Kick off: </div>
      <div className="text-left text-sm font-semibold md:text-base md:text-right ml-1 md:ml-0">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
        {timeLeft.seconds}s
      </div>
    </div>
  );
};

export default function UpcomingGames({ games }: { games: Game[] }) {
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Upcoming Games
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4 shadow-md">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {games.map((game, i) => (
            <div
              key={game.id}
              className={clsx(
                "flex flex-col md:flex-row md:items-center justify-between py-4",
                {
                  "border-t border-gray-200": i !== 0,
                }
              )}
            >
              <div className="flex flex-col items-start md:flex-row md:flex-grow md:items-start">
                <div className="min-w-0 text-left md:text-left md:flex-grow">
                  <p className="text-md font-medium text-black-700 md:block">
                    {game.home_team_name} vs {game.away_team_name}
                  </p>
                  <p className="text-sm text-gray-600 md:block">{game.venue}</p>
                  <div className="flex md:hidden mt-1">
                    <Countdown targetDate={new Date(game.datetime)} />
                  </div>
                </div>
              </div>
              <div className="hidden md:flex flex-col text-sm text-gray-400 md:text-right md:mr-4">
                <Countdown targetDate={new Date(game.datetime)} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Link
            href="/dashboard/tipping"
            className="text-blue-600 font-semibold hover:underline"
          >
            Update tips
          </Link>
        </div>
      </div>
    </div>
  );
}
