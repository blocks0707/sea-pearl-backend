import {SendMessageSchema, GetFriendsSchema} from "../schemas/referralSchema";
import { sendMessage, getFriends } from "../services/referralService";
import { CustomError } from "../config/errHandler";
import { Request, Response } from "express";


export const sendMessageController = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const parseBody = SendMessageSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId, inviteeHandle} = parseBody.data;
        const message = await sendMessage(userId, inviteeHandle);
        if(typeof message !== 'string'){
            throw new CustomError(500, 'Failed to send message');
        }
        res.status(200).json({message: "success"});
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

export const getFriendsController = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const parseBody = GetFriendsSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId} = parseBody.data;
        const friends = await getFriends(userId);
        res.status(200).json(friends);
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