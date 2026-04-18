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
  lastName: z.string()
});

export type AuthorCreationDTO = z.infer<typeof AuthorCreationRequest>;
export type AuthorUpdateDTO = z.infer<typeof AuthorUpdateRequest>;
export type AuthorDTO = z.infer<typeof AuthorResponse>
