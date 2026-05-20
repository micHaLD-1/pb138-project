import { z } from "zod";

export const LoginRequest = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const RegistrationRequest = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(9).max(20)
});

export type LoginDTO = z.infer<typeof LoginRequest>;
export type RegistrationDTO = z.infer<typeof RegistrationRequest>;
