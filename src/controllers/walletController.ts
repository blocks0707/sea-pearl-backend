import {walletSchema, walletWithdrawSchema, walletAddressUpdateSchema} from "../schemas/walletSchema";
import {walletMain, withdraw, walletAddressUpdate} from "../services/walletService";
import {CustomError} from "../config/errHandler";
import {Request, Response} from "express";


export const walletController = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const parseBody = walletSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId} = parseBody.data;
        const {usdt, walletAddress} = await walletMain(userId);
        res.status(200).json({usdt, walletAddress});
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


export const withdrawController = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const parseBody = walletWithdrawSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId, amount} = parseBody.data;
        const balance = await withdraw(userId, amount);
        if(!balance){
            throw new CustomError(400, 'Withdraw failed');
        }
        res.status(200).json({message: 'Withdraw success'});
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


export const walletAddressUpdateController = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const parseBody = walletAddressUpdateSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId, address} = parseBody.data;
        const result = await walletAddressUpdate(userId, address);
        if(!result){
            throw new CustomError(400, 'Address update failed');
        }
        res.status(200).json({message: 'Address update success'});
        return;
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: (error as Error).message });
        return;
    }
};