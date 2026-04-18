import { z } from "zod";

export const CreateCopySchema = z.object({
  bookId: z.number().int().positive(),
  branchId: z.number().int().positive(),
});

export const UpdateCopyStatusSchema = z.object({
  status: z.enum(["available", "borrowed", "reserved", "maintenance"]),
});

export const CreateBranchSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  contact: z.string().optional(),
});

export const UpdateBranchSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().optional(),
  contact: z.string().optional(),
});

export const CreateAuthorSchema = z.object({
  name: z.string().min(1),
});

export const UpdateAuthorSchema = z.object({
  name: z.string().min(1),
});

export const CreateGenreSchema = z.object({
  name: z.string().min(1),
});

export const CreatePublisherSchema = z.object({
  name: z.string().min(1),
});

export const UpdateFineSchema = z.object({
  amount: z.number().nonnegative(),
  status: z.enum(["pending", "paid"]),
  description: z.string().optional(),
});

export const SendNotificationSchema = z.object({
  userId: z.number().int().positive(),
  text: z.string().min(1),
});

export const SendNewsletterSchema = z.object({
  text: z.string().min(1),
});

export interface Publisher {
  id: number;
  name: string;
}

export type CreateCopyBody = z.infer<typeof CreateCopySchema>;
export type UpdateCopyStatusBody = z.infer<typeof UpdateCopyStatusSchema>;
export type CreateBranchBody = z.infer<typeof CreateBranchSchema>;
export type UpdateBranchBody = z.infer<typeof UpdateBranchSchema>;
export type CreateAuthorBody = z.infer<typeof CreateAuthorSchema>;
export type UpdateAuthorBody = z.infer<typeof UpdateAuthorSchema>;
export type CreateGenreBody = z.infer<typeof CreateGenreSchema>;
export type CreatePublisherBody = z.infer<typeof CreatePublisherSchema>;
export type UpdateFineBody = z.infer<typeof UpdateFineSchema>;
export type SendNotificationBody = z.infer<typeof SendNotificationSchema>;
export type SendNewsletterBody = z.infer<typeof SendNewsletterSchema>;
