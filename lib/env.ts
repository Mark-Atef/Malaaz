/* NEW FILE — lib/env.ts */
import { z } from 'zod';

const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = (() => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    // In production: throw and prevent deployment
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing required environment variables');
    }
  }
  return parsed.data ?? process.env;
})();