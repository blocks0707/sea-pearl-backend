import {z} from "zod";

export const RouletteSchema = z.object({
    userId: z.string(),
})