import { z } from "zod";

export const BookCreationRequest = z.object({
  title: z.string().min(1),
  language: z.string().min(1),
  publisherId: z.number().int().positive(),
  yearPublished: z.number().int().positive(),
  description: z.string().max(1000),
  genreIds: z.array(z.number().int().positive()),
  authorIds: z.array(z.number().int().positive())
});

export const BookUpdateRequest = z.object({
  title: z.string().min(1),
  language: z.string().min(1),
  publisherId: z.number().int().positive(),
  yearPublished: z.number().int().positive(),
  description: z.string().max(1000),
  genreIds: z.array(z.number().int().positive()),
  authorIds: z.array(z.number().int().positive())
});

export const GenreResponse = z.object({
  id: z.number().int(),
  name: z.string(),
});

export const AuthorResponse = z.object({
  id: z.number().int(),
  name: z.string()
});

export const BookResponse = z.object({
  id: z.number().int(),
  title: z.string(),
  language: z.string(),
  publisherId: z.number().int(),
  yearPublished: z.number().int(),
  description: z.string(),
  authors: z.array(AuthorResponse),
  genres: z.array(GenreResponse),
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
