import { Request, Response } from "express";
import { BoostSchema } from '../schemas/boostSchema';
import { getBoostStatus, doublexboost, fourxboost } from '../services/miningService';
import { CustomError } from '../config/errHandler';

export const getBoost = async (req: Request, res: Response): Promise<void> => {
    try {
        const query = req.query;
        const parseQuery = BoostSchema.safeParse(query);
        if(!parseQuery.success){
            throw new CustomError(400, 'Invalid request query', 'ERR_INVALID_REQUEST_QUERY');
        }
        const { userId } = parseQuery.data;
        const boostStatus = await getBoostStatus(userId);
        res.status(200).json(boostStatus);
        return;
    } catch (error) {
        console.error(error);
        if( error instanceof CustomError){
            res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
};


export const doubleXBoost = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('doubleXBoost 실행')
        const body = req.body;
        const parseBody = BoostSchema.safeParse(body);
        console.log('body 확인 완료')
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const { userId } = parseBody.data;
        const boostStatus = await doublexboost(userId);
        res.status(200).json(boostStatus);
        return;
    } catch (error) {
        console.error(error);
        if( error instanceof CustomError){
            res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
};


export const fourXBoost = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body;
        const parseBody = BoostSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const { userId } = parseBody.data;
        const boostStatus = await fourxboost(userId);
        res.status(200).json(boostStatus);
        return;
    } catch (error) {
        console.error(error);
        if( error instanceof CustomError){
            res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
};