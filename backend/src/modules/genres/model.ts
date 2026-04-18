import { z } from "zod";

export const CreateGenreSchema = z.object({
  name: z.string().min(1),
});

export interface Genre {
  id: number;
  name: string;
}

export type CreateGenreBody = z.infer<typeof CreateGenreSchema>;
