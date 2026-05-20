import { z } from "zod";

export const PublisherCreationRequest = z.object({
  name: z.string().min(1).max(255)
});

export const PublisherUpdateRequest = z.object({
  name: z.string().min(1).max(255)
});

export const PublisherResponse = z.object({
  id: z.number().int(),
  name: z.string()
});

export const PublishersResponse = z.object({
  publishers: z.array(PublisherResponse),
  page: z.number().int(),
  pageSize: z.number().int(),
  total: z.number().int()
});

export type PublisherCreationDTO = z.infer<typeof PublisherCreationRequest>;
export type PublisherUpdateDTO = z.infer<typeof PublisherUpdateRequest>;
export type PublisherDTO = z.infer<typeof PublisherResponse>;
export type PublishersDTO = z.infer<typeof PublishersResponse>;
