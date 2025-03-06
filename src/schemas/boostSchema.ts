import zod from 'zod';


export const BoostSchema = zod.object({
    userId: zod.string(),
})