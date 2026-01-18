import { z } from "zod";

// ============ Enums ============
export const itemStatusSchema = z.enum(["active", "inactive", "archived"]);

// ============ Entity Schema (API Response) ============
// This is an example entity - replace with your actual domain entities
export const itemSchema = z.object({
  item_id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: itemStatusSchema,
  image_url: z.string().url().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ============ Input Schemas (Forms) ============
export const createItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: itemStatusSchema.default("active"),
  image_url: z.string().url().optional(),
});

export const updateItemSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: itemStatusSchema.optional(),
  image_url: z.string().url().optional(),
});

// ============ Inferred Types (Single Source of Truth) ============
export type ItemStatus = z.infer<typeof itemStatusSchema>;
export type Item = z.infer<typeof itemSchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
