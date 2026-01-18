import type {
  CreateItemInput,
  Item,
  ItemsListResponse,
  ListResponse,
  MediaUploadRequest,
  MediaUploadResponse,
  UpdateItemInput,
  User,
} from "@/schemas";
import { env } from "./env";

class ApiClient {
  private apiUrl: string;
  private getToken: () => string | null;

  constructor(getToken: () => string | null) {
    this.apiUrl = env.API_URL;
    this.getToken = getToken;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.apiUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const raw = await response.text().catch(() => "");
      let message = `HTTP ${response.status}`;

      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          message = parsed.message || parsed.error || message;
        } catch {
          message = raw;
        }
      }

      throw new ApiError(message, response.status);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // ============ Auth ============
  async getMe(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  // ============ Items (Example CRUD) ============
  // Replace "items" with your actual entity name
  async listItems(params?: {
    limit?: number;
    cursor?: string;
  }): Promise<ListResponse<Item>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.cursor) queryParams.set("cursor", params.cursor);

    const query = queryParams.toString();
    const response = await this.request<ItemsListResponse>(
      `/items${query ? `?${query}` : ""}`,
    );
    return {
      items: response.items,
      count: response.count,
      next_cursor: response.next_cursor,
      has_more: response.has_more,
    };
  }

  async getItem(itemId: string): Promise<Item> {
    return this.request<Item>(`/items/${itemId}`);
  }

  async createItem(data: CreateItemInput): Promise<Item> {
    return this.request<Item>("/items", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateItem(itemId: string, data: UpdateItemInput): Promise<Item> {
    return this.request<Item>(`/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteItem(itemId: string): Promise<void> {
    return this.request<void>(`/items/${itemId}`, {
      method: "DELETE",
    });
  }

  // ============ Media ============
  async getUploadUrl(data: MediaUploadRequest): Promise<MediaUploadResponse> {
    return this.request<MediaUploadResponse>("/media/upload", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async uploadFile(uploadUrl: string, file: File): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new ApiError("Failed to upload file", response.status);
    }
  }
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export { ApiClient };
