import {ProfileSchema} from "../schemas/profileSchema";
import {getProfile} from "../services/profileService";
import {CustomError} from "../config/errHandler";

export const getProfileController = async (req: any, res: any) => {
    try {
        const body = req.query;
        const parseBody = ProfileSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId} = parseBody.data;
        const profile = await getProfile(userId);
        return res.status(200).json(profile);
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
        }
        return res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        
    }
}