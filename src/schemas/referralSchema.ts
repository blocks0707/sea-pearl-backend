import {z} from "zod";

export const SendMessageSchema = z.object({
    userId: z.string(),
    inviteeHandle: z.string(),
})

export const GetFriendsSchema = z.object({
    userId: z.string(),
})