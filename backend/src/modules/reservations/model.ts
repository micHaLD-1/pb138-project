import { z } from "zod";

export const CreateReservationSchema = z.object({
  userId: z.number().int().positive(),
  bookCopyId: z.number().int().positive(),
  fromDate: z.string().date(),
  toDate: z.string().date(),
  price: z.number().nonnegative().optional(),
});

export const NotifySchema = z.object({
  bookId: z.number().int().positive(),
});

export interface Reservation {
  id: number;
  userId: number;
  bookCopyId: number;
  fromDate: string;
  toDate: string;
  price: number | null;
}

export type CreateReservationBody = z.infer<typeof CreateReservationSchema>;
export type NotifyBody = z.infer<typeof NotifySchema>;
