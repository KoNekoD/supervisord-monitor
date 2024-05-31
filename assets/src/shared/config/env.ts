import { z } from 'zod';

export const envSchema = z.object({
  PROD: z.boolean(),
  DEV: z.boolean(),
  VITE_API_URL: z.string().url(),
});

export type EnvType = z.infer<typeof envSchema>;

export function validateEnv(): EnvType {
  const result = envSchema.safeParse(import.meta.env);

  if (!result.success) {
    throw new Error('Invalid environment variables:' + result.error);
  }

  return result.data;
}

export const ENV = validateEnv();
