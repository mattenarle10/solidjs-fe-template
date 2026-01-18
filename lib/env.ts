import { z } from "zod";

// Define your environment variables here
// All VITE_ prefixed vars are exposed to the client
const envSchema = z.object({
  API_URL: z.string().url(),
  COGNITO_USER_POOL_ID: z.string().min(1),
  COGNITO_CLIENT_ID: z.string().min(1),
  COGNITO_REGION: z.string().min(1),
});

export const env = envSchema.parse({
  API_URL: import.meta.env.VITE_API_URL,
  COGNITO_USER_POOL_ID: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID: import.meta.env.VITE_COGNITO_CLIENT_ID,
  COGNITO_REGION: import.meta.env.VITE_COGNITO_REGION,
});
