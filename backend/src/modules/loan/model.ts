import { z } from "zod";

export const LoanCreationRequest = z.object({
  userId: z.number().int().positive(),
  bookCopyId: z.number().int().positive(),
  loanDate: z.string().date(),
  expectedReturnDate: z.string().date(),
  actualReturnDate: z.string().date(),
  price: z.number().nonnegative(),
});

export const LoanUpdateRequest = z.object({
  expectedReturnDate: z.string().date(),
  price: z.number().nonnegative(),
});

export const LoanResponse = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  bookCopyId: z.number().int(),
  loanDate: z.string(),
  expectedReturnDate: z.string(),
  actualReturnDate: z.string().nullable(),
  price: z.number()
});

export const LoansResponse = z.object({
  loans: z.array(LoanResponse),
  page: z.number().int(),
  pageSize: z.number().int(),
  total: z.number().int(),
});

export type LoanCreationDTO = z.infer<typeof LoanCreationRequest>;
export type LoanUpdateDTO = z.infer<typeof LoanUpdateRequest>;

export type LoanDTO = z.infer<typeof LoanResponse>;
export type LoansDTO = z.infer<typeof LoansResponse>;
