
import {  getUserById, getUserByTelegramUid, updateUser, accessToken, refreshToken} from '../models/userModel';
import { getAssetByUserId, updateAsset } from '../models/assetModel';
import { getMiningByUserId } from '../models/miningModel';
import { createTransaction } from '../models/transactionModel';
import { loginQuest } from '../services/questService';
import { CustomError } from '../config/errHandler';
import { db } from '../config/db';
import { Timestamp } from 'firebase-admin/firestore';
import { validate3rd } from '@telegram-apps/init-data-node';
import * as logger from "firebase-functions/logger";
import dotenv from 'dotenv';
dotenv.config();



async function objectToQueryString(obj: Record<string, any>): Promise<string> {
    return Object.entries(obj)
        .map(([key, value]) => {
            if (typeof value === "object" && value !== null) {
                // 객체나 배열을 JSON 문자열로 변환
                value = JSON.stringify(value);
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
        })
        .join("&");
}

async function verifyTelegramHash(data: Record<string, any>): Promise<boolean> {
    // (1) hash 필드를 제외한 나머지 필드들을 정렬된 문자열로 변환
    if (typeof data !== "object") {
      throw new CustomError(400, "data must be an object");
    }
    const initData = await objectToQueryString(data);
    const bot_token = process.env.BOT_TOKEN ? process.env.BOT_TOKEN.slice(0,10) : '';
    console.log(`extract bot_token: ${bot_token}`);
    try {
        await validate3rd(initData, parseInt(bot_token));
    } catch (error) {
        return false;
    }
    return true;
};
  

function extractTelegramId(data: any): number {
    const rawData = {...data};
    logger.info(rawData);
    let telegramId = 0;
    for (const key in rawData) {
        if (typeof rawData[key] === 'number' && key === 'id') {
            telegramId = rawData[key];
            break;
        } else if (typeof rawData[key] === 'object') {
            telegramId = extractTelegramId(rawData[key]);
            break;
        } else {
            telegramId = 0;
        }
    }
    console.log('telegramId 4', telegramId);
    return telegramId;
}


export const gameMain = async (userData: any): Promise<null | any> => {
    console.log('userData 4', userData);
    const userCollection = db.collection('users');
    const assetCollection = db.collection('assets');
    const miningCollection = db.collection('minings');
    const chipCollection = db.collection('chips');
    const inviteCollection = db.collection('invites');

    try {
        const secretKey = process.env.TELEGRAM_PUBLIC_KEY;

        if(!secretKey){
            throw new CustomError(400, 'secretKey not found');
        }

        
        if(!verifyTelegramHash(userData)){
            throw new CustomError(401, 'Unauthorized');
        }

        const telegramUid = extractTelegramId(userData);
       
        if (!telegramUid) {
            throw new CustomError(401, 'Unauthorized');
        }
        const user = await getUserByTelegramUid({ telegramUid: telegramUid });
        
        let userId!: string;

        if(user === null){
            // Create new user and related documents
            const invitee = await inviteCollection.where('guestId', '==', telegramUid).limit(1).get();
            if(invitee.docs.length > 0){
                await inviteCollection.doc(invitee.docs[0].id).update({accepted: true});
                const inviter = await userCollection.where('id', '==', invitee.docs[0].data().userId).limit(1).get();
                await updateUser(inviter.docs[0].id,{friends: inviter.docs[0].data().friends+1});
            }
            
            await db.runTransaction(async (transaction) => {
                const query = userCollection.orderBy('userNumber', 'desc').limit(1)
                const querySnapshot = await transaction.get(query)

                let userCount:number=0;
                if(!querySnapshot.empty){
                    const userData = querySnapshot.docs[0].data() as any;
                    userCount = userData.userNumber;
                }
                const newUserDoc = userCollection.doc();
                userId = newUserDoc.id;
                await transaction.set(newUserDoc, {
                    userNumber: userCount+1,
                    telegramUid: telegramUid,
                    firstName: userData.user.first_name,
                    lastName: userData.user.last_name,
                    photo_url: userData.user.photo_url,
                    username: userData.user.username,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now()
                })
                // const newUserDoc = await createUser({userNumber: userCount+1, telegramUid: telegramUid, firstName: userData.user.first_name, lastName: userData.user.last_name, photo_url: userData.user.photo_url, username: userData.user.username });
            });
            await db.runTransaction(async (transaction) => {    
                const newAssetDoc = assetCollection.doc();
                const newMiningDoc = miningCollection.doc();
                const newChipDoc = chipCollection.doc();
                // transaction.set(newUserDoc, {telegramUid: telegramUid, firstName: userData.user.first_name, lastName: userData.user.last_name, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
                transaction.set(newAssetDoc, { userId, pearl: 0, shell: 0, usdt: 0, box: 0, ads: 0, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
                transaction.set(newMiningDoc, { userId, level: 1, storage: 0, fassive: 0, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
                transaction.set(newChipDoc, { userId, roulette_round: 0, roulette_updatedAt: Timestamp.now(), shell_raffle: [], pearl_raffle: [], createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
            });
             
        } else {
            userId = user.id;
            let data:any = {};
            if(userData.user.first_name !== user.firstName){
                data.firstName = userData.user.first_name;
            } 
            if(userData.user.last_name !== user.lastName){
                data.lastName = userData.user.last_name;
            }
            if(userData.user.photo_url !== user.photo_url){
                data.photo_url = userData.user.photo_url;
            }
            if(userData.user.username !== user.username){
                data.username = userData.user.username;
            }
            await updateUser(userId, data);
        } 

        console.log('userId 1===============================', userId);

        const access = await accessToken();
        console.log('access 1===============================', access);
        const refresh = await refreshToken();
        console.log('refresh 1===============================', refresh);
        const realUser = await getUserById(userId);
        console.log('realUser 1===============================', realUser);
        if(!realUser){
            throw new CustomError(400, 'User not found');
        }

        const asset = await getAssetByUserId({userId});
        if(!asset){
            throw new CustomError(400, 'Asset not found');
        }

        const mining = await getMiningByUserId({userId});
        if(!mining){
            throw new CustomError(400, 'Mining not found');
        }
        await loginQuest(userId);

        const main = {
            accessToken: access,
            refreshToken: refresh,
            user: {
                id: realUser.id,
                telegramUid: realUser.telegramUid,
                telegramFirstName: realUser.firstName? realUser.firstName : '',
                telegramLastName: realUser.lastName? realUser.lastName : '',
                createdAt: realUser.createdAt?.toDate().toISOString(),
                updatedAt: realUser.updatedAt?.toDate().toISOString()
            },
            asset: {
                id: asset.id,
                shell: asset.shell,
                pearl: asset.pearl,
                usdt: asset.usdt
            },
            mining: {
                id: mining.id,
                active: mining.storage,
                fassive: mining.fassive
            }
            
        };

        return main;


    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const addPearl = async (userId: string, pearl: number): Promise<boolean> => {
    try {
        const asset = await getAssetByUserId({userId: userId});
        let lastPearl;
        if(!asset){
            throw new CustomError(400, 'Asset not found');
        } else {
            lastPearl = asset.pearl;
        }

        const tr = await createTransaction({fee_type: 'pearl', from: 'company', to: userId, amount: pearl, reason: 'tap'});
        await updateAsset(userId, {pearl: lastPearl + tr.amount });
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};



