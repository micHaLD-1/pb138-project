import { z } from "zod";

export const GenreCreationRequest = z.object({
  name: z.string().min(1).max(100),
});

export const GenreResponse = z.object({
  id: z.number().int(),
  name: z.string(),
});

export const GenresResponse = z.object({
  genres: z.array(GenreResponse),
  page: z.number().int(),
  pageSize: z.number().int(),
  total: z.number().int(),
});

export type GenreCreationDTO = z.infer<typeof GenreCreationRequest>;

export type GenreDTO = z.infer<typeof GenreResponse>;
export type GenresDTO = z.infer<typeof GenresResponse>;
