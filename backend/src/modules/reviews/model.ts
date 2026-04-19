import { z } from "zod";

export const ReviewCreationRequest = z.object({
  bookId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  content: z.string().min(1).max(1000)
});

export const ReviewUpdateRequest = z.object({
  rating: z.number().int().min(1).max(5),
  content: z.string().min(1).max(1000)
});

export const ReviewResponse = z.object({
  id: z.number().int(),
  rating: z.number().int(),
  content: z.string(),
  createdAt: z.string(),
  userName: z.string()
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
