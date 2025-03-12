import zod from 'zod';

// export const GameSchema = zod.object({
//     query_id: zod.string().optional(),
//     signature: zod.string().optional(),
//     user: zod.object({
//         id: zod.number(),
//         allows_write_to_pm: zod.boolean().optional(),
//         first_name: zod.string().optional(),
//         last_name: zod.string().optional(),
//         username: zod.string().optional(),
//         is_premium: zod.boolean().optional(),
//         language_code: zod.string().optional(),
//         photo_url: zod.string().optional(),
//     }),
//     auth_date: zod.string(),
//     hash: zod.string(),
// })

export const GameSchema = zod.object({
    initData: zod.string()
})


export const TapGameSchema = zod.object({
    userId: zod.string(),
    pearl: zod.number(),
})