import { afterEach, vi } from "vitest";

vi.mock("@/prisma", () => ({
  default: {
    game: {
      findMany: vi.fn(),
    },
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});