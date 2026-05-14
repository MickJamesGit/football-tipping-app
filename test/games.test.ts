import { describe, it, expect, vi, } from "vitest";
import { getNextGamesBySports } from "../lib/games/games";
import * as repo from "../lib/games/games.repo";

vi.mock("@/lib/games/games.repo", () => ({
  fetchNextGamesBySports: vi.fn(),
}));

const mockFetch =
  repo.fetchNextGamesBySports as unknown as ReturnType<typeof vi.fn>;

describe("getNextGamesBySports", () => {
  it("returns first upcoming game per sport", async () => {
    mockFetch.mockResolvedValue([
      {
        sport: "afl",
        datetime: new Date("2026-05-20"),
        round: "1",
      },
      {
        sport: "afl",
        datetime: new Date("2026-05-21"),
        round: "2",
      },
      {
        sport: "nrl",
        datetime: new Date("2026-05-19"),
        round: "1",
      },
    ]);

    const result = await getNextGamesBySports({sports: ["afl", "nrl"]});

    expect(result).toEqual([
      {
        sport: "afl",
        nextGameDate: new Date("2026-05-20"),
        nextGameRound: "1",
      },
      {
        sport: "nrl",
        nextGameDate: new Date("2026-05-19"),
        nextGameRound: "1",
      },
    ]);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("returns null values when no games exist", async () => {
    mockFetch.mockResolvedValue([]);

    const result = await getNextGamesBySports({sports: ["afl"]});

    expect(result).toEqual([
      {
        sport: "afl",
        nextGameDate: null,
        nextGameRound: null,
      },
    ]);
  });
});
