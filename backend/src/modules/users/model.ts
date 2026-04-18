import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export const CreateReviewSchema = z.object({
  bookId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  text: z.string().optional(),
});

export interface User {
  id: number;
  name: string;
  email: string;
  role: "guest" | "member" | "staff" | "admin";
  contact: string | null;
}

export type UpdateProfileBody = z.infer<typeof UpdateProfileSchema>;
export type ChangePasswordBody = z.infer<typeof ChangePasswordSchema>;
export type CreateReviewBody = z.infer<typeof CreateReviewSchema>;
