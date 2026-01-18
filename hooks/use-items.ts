import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import { useApi } from "@/context/api-context";
import type { CreateItemInput, UpdateItemInput } from "@/schemas";

// Example CRUD hooks - copy this pattern for your entities

export function useItems(options?: { enabled?: boolean }) {
  const api = useApi();

  return createQuery(() => ({
    queryKey: ["items"],
    queryFn: () => api.listItems(),
    enabled: options?.enabled ?? true,
  }));
}

export function useItem(itemId: () => string | undefined) {
  const api = useApi();

  return createQuery(() => ({
    queryKey: ["item", itemId()],
    queryFn: () => {
      const id = itemId();
      return api.getItem(id as string);
    },
    enabled: !!itemId(),
  }));
}

export function useCreateItem() {
  const api = useApi();
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (data: CreateItemInput) => api.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  }));
}

export function useUpdateItem() {
  const api = useApi();
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: ({ itemId, data }: { itemId: string; data: UpdateItemInput }) =>
      api.updateItem(itemId, data),
    onSuccess: (_data, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["item", itemId] });
    },
  }));
}

export function useDeleteItem() {
  const api = useApi();
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (itemId: string) => api.deleteItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  }));
}
