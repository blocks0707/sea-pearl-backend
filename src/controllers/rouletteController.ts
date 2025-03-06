import {RouletteSchema} from "../schemas/rouletteSchema";
import {getPlay, getNowEntry} from "../services/rouletteSerivce";
import {CustomError} from "../config/errHandler";
import {Request, Response} from "express";

export const getPlayController = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const parseBody = RouletteSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId} = parseBody.data;
        const play = await getPlay(userId);
        if(!play){
            throw new CustomError(400, 'Play failed');
        }
        res.status(200).json(play);
        return;
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
};


export const getNowEntryController = async (req: Request, res: Response) => {
    try {
        const body = req.query;
        const parseBody = RouletteSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId} = parseBody.data;
        const nowEntry = await getNowEntry(userId);
        if(!nowEntry){
            throw new CustomError(400, 'Entry not found');
        }
        res.status(200).json(nowEntry);
        return;
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
};