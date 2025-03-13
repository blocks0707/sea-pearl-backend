import {getMiningData, miningUpgrade, storageUpgrade, movePearlToAsset} from '../services/miningService';
import {CustomError} from '../config/errHandler';
import { Request, Response } from "express";
import {MiningSchema} from '../schemas/miningSchema';

export const getMining = async (req: Request, res: Response): Promise<void> => {
    try {
        const query = req.query;
        const parseQuery = MiningSchema.safeParse(query);
        if(!parseQuery.success){
            throw new CustomError(400, 'Invalid request query', 'ERR_INVALID_REQUEST_QUERY');
        }
        const {userId} = parseQuery.data;
        const mining = await getMiningData(userId);
        res.status(200).json(mining);
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

export const upgradeMining = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body;
        const parseBody = MiningSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId} = parseBody.data;
        const mining = await miningUpgrade(userId);
        if(!mining){
            throw new CustomError(500, 'Mining upgrade failed');
        }
        res.status(200).json({message: 'Mining upgraded successfully'});
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

export const upgradeStorage = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const parseBody = MiningSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId} = parseBody.data;
        const mining = await storageUpgrade(userId);
        if(!mining){
            throw new CustomError(400, 'Storage upgrade failed');
        }
        res.status(200).json({message: 'Storage upgraded successfully'});
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

export const movePearlToAssetController = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const parseBody = MiningSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId} = parseBody.data;
        const mining = await movePearlToAsset(userId);
        if(!mining){
            throw new CustomError(400, 'Move pearl to asset failed');
        }
        res.status(200).json({message: 'Move pearl to asset successfully'});
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

