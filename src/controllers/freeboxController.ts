import {openFreebox, getRestBox} from '../services/freeboxService';
import {CustomError} from '../config/errHandler';
import {FreeboxSchema} from '../schemas/freeboxSchema';



export const openFreeboxController = async (req: any, res: any): Promise<any> => {
    try {
        const body = req.body;
        const parseBody = FreeboxSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId} = parseBody.data;
        if (!userId || typeof userId !== 'string') {
          throw new CustomError(400, 'Invalid userId', 'ERR_INVALID_USER_ID');
        }
        const result = await openFreebox(userId);
        return res.status(200).json({ message: 'Freebox opened successfully', result });
    } catch (error) {
        console.error(error);
        if( error instanceof CustomError){
            return res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
        }
        return res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
    }
};


export const getRestBoxController = async (req: any, res: any): Promise<any> => {
    try {
        const query = req.query;
        const parseQuery = FreeboxSchema.safeParse(query);
        if(!parseQuery.success){
            throw new CustomError(400, 'Invalid request query', 'ERR_INVALID_REQUEST_QUERY');
        }
        const {userId} = parseQuery.data;
        const result = await getRestBox(userId);
        return res.status(200).json({ message: 'Rest Box Count successfully', result });
    } catch (error) {
        console.error(error);
        if( error instanceof CustomError){
            return res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
        }
        return res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
    }
};


