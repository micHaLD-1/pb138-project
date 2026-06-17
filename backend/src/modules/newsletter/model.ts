import { z } from "zod";

export const NewsletterCreationRequest = z.object({
  subject: z.string().min(1).max(255),
  text: z.string().min(1),
  recipientUserIds: z.array(z.number().int().positive()).optional()
});

export const NewsletterResponse = z.object({
  id: z.number().int(),
  employeeId: z.number().int(),
  employeeName: z.string(),
  createdAt: z.string(),
  subject: z.string(),
  text: z.string(),
  recipientCount: z.number().int()
});

export const NewslettersResponse = z.object({
  newsletters: z.array(NewsletterResponse),
  page: z.number().int(),
  pageSize: z.number().int(),
  total: z.number().int()
});

export const FeedbackCreationRequest = z.object({
  userEmail: z.string().email(),
  text: z.string().min(1)
});

export const FeedbackResponse = z.object({
  id: z.number().int(),
  userEmail: z.string(),
  createdAt: z.string(),
  text: z.string()
});

export const FeedbacksResponse = z.object({
  feedbacks: z.array(FeedbackResponse),
  page: z.number().int(),
  pageSize: z.number().int(),
  total: z.number().int()
});

export const SendCampaignResponse = z.object({
  message: z.string(),
  campaignId: z.number().int().optional()
});

export const SyncContactsResponse = z.object({
  message: z.string(),
  syncedCount: z.number().int()
});

export type NewsletterCreationDTO = z.infer<typeof NewsletterCreationRequest>;
export type NewsletterDTO = z.infer<typeof NewsletterResponse>;
export type NewslettersDTO = z.infer<typeof NewslettersResponse>;
export type FeedbackCreationDTO = z.infer<typeof FeedbackCreationRequest>;
export type FeedbackDTO = z.infer<typeof FeedbackResponse>;
export type FeedbacksDTO = z.infer<typeof FeedbacksResponse>;
export type SendCampaignDTO = z.infer<typeof SendCampaignResponse>;
export type SyncContactsDTO = z.infer<typeof SyncContactsResponse>;