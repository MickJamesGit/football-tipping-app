import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { randomUUID } from "crypto";

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export const isValidRound = (round: string | undefined): boolean => {
  // Check if the round is a valid integer and within the expected range
  if (round && !isNaN(Number(round))) {
    const roundNumber = Number(round);
    // Assuming valid rounds are between 1 and 30 for example purposes
    return roundNumber >= 1 && roundNumber <= 30;
  }
  return false;
};

export const generateSessionToken = () => {
  // Use `randomUUID` if available. (Node 15.6++)
  return randomUUID?.();
};

export const fromDate = (
  timeInSeconds: number,
  baseDate: number = Date.now()
): Date => {
  return new Date(baseDate + timeInSeconds * 1000);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
