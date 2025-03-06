import {z} from "zod";

export const ProfileSchema = z.object({
    userId: z.string(),
})