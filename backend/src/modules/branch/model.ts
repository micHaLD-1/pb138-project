import { z } from "zod";

export const BranchCreationRequest = z.object({
  name: z.string().min(1).max(100),
  address: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().min(6).max(20),
});

export const BranchUpdateRequest = z.object({
  address: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().min(6).max(20),
});

export const BranchResponse = z.object({
  id: z.number().int(),
  name: z.string(),
  address: z.string(),
  email: z.string(),
  phone: z.string(),
});

export const BranchesResponse = z.object({
  branches: z.array(BranchResponse),
  page: z.number().int(),
  pageSize: z.number().int(),
  total: z.number().int(),
});

export type BranchCreationDTO = z.infer<typeof BranchCreationRequest>;
export type BranchUpdateDTO = z.infer<typeof BranchUpdateRequest>;

export type BranchDTO = z.infer<typeof BranchResponse>;
export type BranchesDTO = z.infer<typeof BranchesResponse>;
