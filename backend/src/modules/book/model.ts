import { z } from "zod";

export const BookCreationRequest = z.object({
  title: z.string().min(1),
  language: z.string().min(1),
  publisherId: z.number().int().positive(),
  yearPublished: z.number().int().positive(),
  description: z.string().max(1000),
  genreIds: z.array(z.number().int().positive()),
  authorIds: z.array(z.number().int().positive()),
  // tagIds: z.array(z.number().int().positive()).optional(), // TODO: Tagy
  copyCount: z.number().int().min(1).default(1)
});

export const BookUpdateRequest = z.object({
  title: z.string().min(1),
  language: z.string().min(1),
  publisherId: z.number().int().positive(),
  yearPublished: z.number().int().positive(),
  description: z.string().max(1000),
  genreIds: z.array(z.number().int().positive()),
  authorIds: z.array(z.number().int().positive()),
  // tagIds: z.array(z.number().int().positive()).optional() // TODO: Tagy
});

export const BookResponse = z.object({
  id: z.number().int(),
  title: z.string(),
  language: z.string(),
  publisherId: z.number().int(),
  publisherName: z.string(),
  yearPublished: z.number().int(),
  description: z.string(),
  coverImageUrl: z.string().nullable(),
  authors: z.array(z.string()),
  genres: z.array(z.string()),
  // tags: z.array(z.string()), // TODO: Tagy
  availableCopies: z.number().int(),
  totalCopies: z.number().int()
});

export const BooksResponse = z.object({
  books: z.array(BookResponse),
  page: z.number().int(),
  pageSize: z.number().int(),
  total: z.number().int(),
});

export type BookCreationDTO = z.infer<typeof BookCreationRequest>;
export type BookUpdateDTO = z.infer<typeof BookUpdateRequest>;

export type BookDTO = z.infer<typeof BookResponse>;
export type BooksDTO = z.infer<typeof BooksResponse>;
