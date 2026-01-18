import { createMutation } from "@tanstack/solid-query";
import { useApi } from "@/context/api-context";
import type { MediaEntityType } from "@/schemas";

interface UploadMediaParams {
  entityType: MediaEntityType;
  entityId: string;
  file: File;
}

export function useUploadMedia() {
  const api = useApi();

  return createMutation(() => ({
    mutationFn: async ({ entityType, entityId, file }: UploadMediaParams) => {
      const { upload_url, public_url } = await api.getUploadUrl({
        entity_type: entityType,
        entity_id: entityId,
        filename: file.name,
        content_type: file.type,
      });

      await api.uploadFile(upload_url, file);

      return public_url;
    },
  }));
}
