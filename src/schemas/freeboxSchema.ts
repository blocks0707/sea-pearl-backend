import zod from 'zod';


export const FreeboxSchema = zod.object({
    userId: zod.string(),
})


export const CreateFreeboxSchema = zod.object({
    reward: zod.array(zod.object({
        reward_type: zod.string(),
        amount: zod.number(),
        chance: zod.number(),
    }))
})

export const UpdateFreeboxSchema = zod.object({
    userId: zod.string(),
    reward: zod.array(zod.object({
        reward_type: zod.string(),
        amount: zod.number(),
        chance: zod.number(),
    })).optional(),
})