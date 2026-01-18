import { z } from "zod";

// ============ Enums ============
export const userRoleSchema = z.enum(["admin", "user"]);

// ============ Entity Schema (API Response) ============
export const userSchema = z.object({
  user_id: z.string(),
  email: z.string().email(),
  display_name: z.string().optional(),
  avatar_url: z.string().url().optional(),
  role: userRoleSchema,
  created_at: z.string(),
  updated_at: z.string(),
});

// ============ Input Schemas (Forms) ============
export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: userRoleSchema,
  display_name: z.string().optional(),
});

export const updateUserSchema = z.object({
  display_name: z.string().optional(),
  avatar_url: z.string().url().optional(),
  role: userRoleSchema.optional(),
});

// ============ Inferred Types (Single Source of Truth) ============
export type UserRole = z.infer<typeof userRoleSchema>;
export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
