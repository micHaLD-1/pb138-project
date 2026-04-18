import { z } from "zod";

export const LoanCreationRequest = z.object({
  userId: z.number().int().positive(),
  bookCopyId: z.number().int().positive(),
  loanDate: z.string().date(),
  expectedReturnDate: z.string().date(),
  actualReturnDate: z.string().date(),
  price: z.number().nonnegative().optional(),
});

export type LoanCreationDTO = z.infer<typeof LoanCreationRequest>;
