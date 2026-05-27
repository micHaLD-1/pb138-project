import { z } from "zod";

export const ReviewCreationRequest = z.object({
  bookId: z.number().int().positive(),
  content: z.string().min(1).max(1000)
});

export const ReviewUpdateRequest = z.object({
  content: z.string().min(1).max(1000)
});

export const ReviewResponse = z.object({
  id: z.number().int(),
  content: z.string(),
  createdAt: z.string(),
  userId: z.number().int(),
  userFirstName: z.string(),
  userLastName: z.string()
});

export const ReviewsResponse = z.object({
  reviews: z.array(ReviewResponse),
  page: z.number().int(),
  pageSize: z.number().int(),
  total: z.number().int()
});

export type ReviewCreationDTO = z.infer<typeof ReviewCreationRequest>;
export type ReviewUpdateDTO = z.infer<typeof ReviewUpdateRequest>;

export type ReviewDTO = z.infer<typeof ReviewResponse>;
export type ReviewsDTO = z.infer<typeof ReviewsResponse>;
