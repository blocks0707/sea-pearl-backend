import { z } from 'zod';

export const RaffleSchema = z.object({
    userId: z.string(),
})