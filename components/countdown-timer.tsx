"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: Date;
}

export const CountdownTimer: React.FC<CountdownProps> = ({ targetDate }) => {
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

  function formatTime(value: number): string {
    return value.toString().padStart(2, "0");
  }

  return (
    <>
      {timeLeft.days > 1 ? (
        <>in {timeLeft.days} days</> // Show days if more than 1 day left
      ) : (
        <>
          {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:
          {formatTime(timeLeft.seconds)}
        </>
      )}
    </>
  );
};
