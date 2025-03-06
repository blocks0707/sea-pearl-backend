import { ZodSchema } from "zod";



export const reqbodyValidate = (schema: ZodSchema) => (req: any, res: any, next: any) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

