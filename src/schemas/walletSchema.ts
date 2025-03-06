import {z} from "zod";

export const walletSchema = z.object({
    userId: z.string()
});

export const walletWithdrawSchema = z.object({
    userId: z.string(),
    amount: z.number(),
});


export const walletAddressUpdateSchema = z.object({
    userId: z.string(),
    address: z.string(),
})