import { z } from "zod";

export const RulesUpdateRequest = z.object({
  fineAmountPerDay: z.number().int().nonnegative().optional(),
  maxBooksPerUser: z.number().int().positive().optional(),
  gracePeriodDays: z.number().int().nonnegative().optional()
});

export const RulesResponse = z.object({
  fineAmountPerDay: z.number().int(),
  maxBooksPerUser: z.number().int(),
  gracePeriodDays: z.number().int(),
  updatedAt: z.string()
});

export type RulesUpdateDTO = z.infer<typeof RulesUpdateRequest>;
export type RulesDTO = z.infer<typeof RulesResponse>;
