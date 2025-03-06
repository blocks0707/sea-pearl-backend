import {createInvite, getAllInvites} from "../models/inviteModel";
import { InviteResponse } from '../interfaces/inviteInterface';
import { Timestamp } from 'firebase-admin/firestore';
import { CustomError } from '../config/errHandler';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();



async function getTelegramUid(username:string): Promise<string> {
    const bot_token = process.env.BOT_TOKEN;
    const url = `https://api.telegram.org/bot${bot_token}/getChat`;
    try {
        const response = await axios.post(url, {
            chat_id: username
        });
        if (response.data.ok) {
            return response.data.result.id;
        }
        throw new CustomError(404, 'User not found');
    } catch (error) {
        throw error;
    }
}

export const sendMessage = async (userId: string, inviteeHandle: string): Promise<string> => {
    try {
        const bot_token = process.env.BOT_TOKEN;
        const url = `https://api.telegram.org/bot${bot_token}/sendMessage`;
        
        const inviteeTelegramUid = await getTelegramUid(inviteeHandle);
        
        const text = `Hi @${inviteeHandle}. You have been invited to join the sea pearl! https://t.me/sea_pearl_game_test_bot \n`;
        
        const response = await axios.post(url, {
            chat_id: inviteeTelegramUid,
            text: text
        });

        if (!response.data.ok) {
            throw new CustomError(500, 'Failed to send message');
        }

        const res = await createInvite({
            userId: userId,
            guestId: inviteeTelegramUid,
            accepted: false,
            createdAt: Timestamp.now(),
        });

        return res.id;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const getFriends = async (userId: string): Promise<InviteResponse[]> => {
    try {
        const invites = await getAllInvites(userId);
        const acceptedFriends = [];
        for (const invite of invites) {
            if (invite.accepted) {
                acceptedFriends.push(invite);
            }
        }

        return acceptedFriends;
    } catch (error) {
        console.error(error);
        throw error;
    }
};