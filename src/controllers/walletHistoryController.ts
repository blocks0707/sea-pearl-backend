import {WalletHistorySchema} from "../schemas/walletHistorySchema";
import {walletHistory} from "../services/walletService";
import {CustomError} from "../config/errHandler";
import {Request, Response} from "express";

export const getWalletHistory = async (req: Request, res: Response): Promise<any> => {
    try {
        const query = req.query;
        const parseQuery = WalletHistorySchema.safeParse(query);
        if(!parseQuery.success){
            throw new CustomError(400, 'Invalid request query', 'ERR_INVALID_REQUEST_QUERY');
        }
        const {userId} = parseQuery.data;
        const walletHistoryData = await walletHistory(userId);
        if(!walletHistoryData){
            throw new CustomError(500, 'Failed to get wallet history');
        }
        res.status(200).json(walletHistoryData);
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