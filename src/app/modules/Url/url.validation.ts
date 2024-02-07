import { z } from 'zod';

const createShortUrlSceham = z.object({
  body: z.object({
    longUrl: z.string(),
    email: z.string().optional(),
  }),
});

export const URLValidation = {
  createShortUrlSceham,
};
