import {RaffleSchema} from '../schemas/raffleSchema';
import {buyPearlRaffle, buyShellRaffle, getShellRaffle, getPearlRaffle} from '../services/raffleService';
import {CustomError} from '../config/errHandler';

export const buyPearlController = async (req: any, res: any) => {
    try {
        const body = req.body;
        const parseBody = RaffleSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId} = parseBody.data;
        const result = await buyPearlRaffle(userId);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
        }
        return res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
    }
};


export const buyShellController = async (req: any, res: any) => {
    try {
        const body = req.body;
        const parseBody = RaffleSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId} = parseBody.data;
        const result = await buyShellRaffle(userId);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
    }
};



export const getShellController = async (req: any, res: any) => {
    try {
        const body = req.query;
        const parseBody = RaffleSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId} = parseBody.data;
        const result = await getShellRaffle(userId);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
        }
        return res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
    }
};

export const getPearlController = async (req: any, res: any) => {
    try {
        const body = req.query;
        const parseBody = RaffleSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId} = parseBody.data;
        const result = await getPearlRaffle(userId);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
        }
        return res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
    }
};