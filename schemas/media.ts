import { z } from "zod";

// ============ Enums ============
export const mediaEntityTypeSchema = z.enum(["user", "item"]);

// ============ Request/Response Schemas ============
export const mediaUploadRequestSchema = z.object({
  entity_type: mediaEntityTypeSchema,
  entity_id: z.string(),
  filename: z.string(),
  content_type: z.string(),
});

export const mediaUploadResponseSchema = z.object({
  upload_url: z.string().url(),
  public_url: z.string().url(),
});

// ============ Inferred Types ============
export type MediaEntityType = z.infer<typeof mediaEntityTypeSchema>;
export type MediaUploadRequest = z.infer<typeof mediaUploadRequestSchema>;
export type MediaUploadResponse = z.infer<typeof mediaUploadResponseSchema>;
