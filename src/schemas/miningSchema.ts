import zod from 'zod';


export const MiningSchema = zod.object({
    userId: zod.string(),
});