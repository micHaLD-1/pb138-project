import { z } from "zod";

// Email validation: 6-64 chars, must contain @
const emailSchema = z
  .email()
  .min(6, "Email must be at least 6 characters")
  .max(64, "Email must be at most 64 characters");

// Password validation: 6-64 chars
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(64, "Password must be at most 64 characters");

// Name validation: 2-50 chars, letters/accents/spaces only
const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be at most 50 characters")

// Sign In Form Schema
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignInFormData = z.infer<typeof signInSchema>;

// Register Form Schema
export const registerSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// Message validation: 10-1000 chars
const messageSchema = z
  .string()
  .min(5, "Message must be at least 10 characters")
  .max(1000, "Message must be at most 1000 characters");

// Footer Message Schema
export const footerMessageSchema = z.object({
  email: emailSchema,
  message: messageSchema,
});

export type FooterMessageData = z.infer<typeof footerMessageSchema>;
