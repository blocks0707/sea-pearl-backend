import {gameMain, addPearl} from '../services/gameService';
import {CustomError} from '../config/errHandler';
import { GameSchema, TapGameSchema } from '../schemas/gameSchema';
import {Request, Response} from "express";



export const gameController = async (req: Request, res: Response): Promise<any> => {
    try {
        const body = req.body;
        const parseBody = GameSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const result = await gameMain(parseBody.data as Record<string, any>);
        res.cookie('access', result.accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('refresh', result.refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        return res.status(200).json({result: result}); 
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
        }
        return res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
    }
};


export const addPearlController = async (req: Request, res: Response): Promise<any> => {
    try {
        const body = req.body;
        const parseBody = TapGameSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId, pearl} = parseBody.data;
        const result = await addPearl(userId, pearl);
        if(!result){
            throw new CustomError(400, 'Failed to add pearl');
        }
        return res.status(200).json({message: 'Pearl added successfully'}); 
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
        }
        return res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
    }
};