import { z } from "zod";

export const ReservationCreationRequest = z.object({
  userId: z.number().int().positive(),
  bookId: z.number().int().positive(),
  fromDate: z.string().date(),
  toDate: z.string().date(),
  price: z.number().nonnegative(),
});

export const ReservationUpdateRequest = z.object({
  fromDate: z.string().date(),
  toDate: z.string().date(),
  price: z.number().nonnegative(),
});

export const ReservationResponse = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  bookId: z.number().int(),
  bookCopyId: z.number().int(),
  fromDate: z.string(),
  toDate: z.string(),
  price: z.number(),
  status: z.string(),
});

export const ReservationsResponse = z.object({
  reservations: z.array(ReservationResponse),
  page: z.number().int(),
  pageSize: z.number().int(),
  total: z.number().int(),
});


export type ReservationCreationDTO = z.infer<typeof ReservationCreationRequest>;
export type ReservationUpdateDTO = z.infer<typeof ReservationUpdateRequest>;

export type ReservationDTO = z.infer<typeof ReservationResponse>;
export type ReservationsDTO = z.infer<typeof ReservationsResponse>;
