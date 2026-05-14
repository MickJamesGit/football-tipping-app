import { z } from "zod";

export const getGamesSchema = z.object({
  sport: z.array(z.string()).min(1),
  status: z.enum(["SCHEDULED", "LIVE", "FINISHED"]).optional(),
  round: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type GetGamesInput = z.infer<typeof getGamesSchema>;