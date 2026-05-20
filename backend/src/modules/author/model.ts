import { z } from "zod";

export const AuthorCreationRequest = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1)
});

export const AuthorUpdateRequest = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1)
});

export const AuthorResponse = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  name: z.string()
});

export const AuthorsResponse = z.object({
  authors: z.array(AuthorResponse),
  page: z.number().int(),
  pageSize: z.number().int(),
  total: z.number().int(),
});

export type AuthorCreationDTO = z.infer<typeof AuthorCreationRequest>;
export type AuthorUpdateDTO = z.infer<typeof AuthorUpdateRequest>;

export type AuthorDTO = z.infer<typeof AuthorResponse>;
export type AuthorsDTO = z.infer<typeof AuthorsResponse>;
