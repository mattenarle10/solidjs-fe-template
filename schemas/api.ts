import { z } from "zod";
import { itemSchema } from "./item";

// ============ Generic API Response Schemas ============
export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
});

// Generic list response factory
export function createListResponseSchema<T extends z.ZodTypeAny>(
  itemSchema: T,
) {
  return z.object({
    items: z.array(itemSchema),
    count: z.number(),
  });
}

// ============ Specific List Response Schemas ============
// Add your entity-specific list responses here

export const itemsListResponseSchema = z.object({
  items: z.array(itemSchema),
  count: z.number(),
  next_cursor: z.string().optional(),
  has_more: z.boolean(),
});

// ============ Inferred Types ============
export type ApiError = z.infer<typeof apiErrorSchema>;
export type ItemsListResponse = z.infer<typeof itemsListResponseSchema>;

// Generic list response type
export interface ListResponse<T> {
  items: T[];
  count: number;
  next_cursor?: string;
  has_more?: boolean;
}
