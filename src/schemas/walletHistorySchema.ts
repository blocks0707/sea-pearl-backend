import {z} from "zod";

export const WalletHistorySchema = z.object({
    userId: z.string()
});