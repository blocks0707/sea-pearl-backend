
import { createUser, getUserById, getUserByTelegramUid, updateUser, accessToken, refreshToken} from '../models/userModel';
import { CreateUser } from '../interfaces/userInterface'
import { getAssetByUserId, updateAsset } from '../models/assetModel';
import { getMiningByUserId } from '../models/miningModel';
import { createTransaction } from '../models/transactionModel';
import { createFassiveStorage, findFassiveStorageByUserId } from '../models/fassiveStorageModel';
import { loginQuest } from '../services/questService';
import { CustomError } from '../config/errHandler';
import { db } from '../config/db';
import { Timestamp } from 'firebase-admin/firestore';
import crypto from 'crypto';
//import * as logger from "firebase-functions/logger";
import dotenv from 'dotenv';
dotenv.config();



// async function objectToQueryString(obj: Record<string, any>): Promise<string> {
//     return Object.entries(obj)
//         .map(([key, value]) => {
//             if (typeof value === "object" && value !== null) {
//                 // 객체나 배열을 JSON 문자열로 변환
//                 value = JSON.stringify(value);
//             }
//             return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
//         })
//         .join("&");
// }

async function verifyTelegramHash(data: string): Promise<boolean> {
    // (1) hash 필드를 제외한 나머지 필드들을 정렬된 문자열로 변환
    // if (typeof data !== "object") {
    //   throw new CustomError(400, "data must be an object");
    // }
    // console.log('data 1', data);
    // const initData = await objectToQueryString(data);
    // const bot_token = process.env.BOT_TOKEN ? process.env.BOT_TOKEN.slice(0,10) : '';
    // console.log(`extract bot_token: ${bot_token}`);
    try {
        
        const params = new URLSearchParams(data);
        const keyValuePairs: string[] = [];
        let receivedHash = '';
      
        // 모든 파라미터 순회
        for (const [key, value] of params.entries()) {
          if (key === 'hash') {
            receivedHash = value;
          }else {
            // 디코딩된 값을 사용하여 key=value 문자열 생성
            keyValuePairs.push(`${key}=${decodeURIComponent(value)}`);
          }
        }
      
        // 알파벳 순으로 정렬 후 줄바꿈 문자로 결합
        keyValuePairs.sort();
        const dataString = keyValuePairs.join('\n');
        

        const botToken = process.env.BOT_TOKEN ? process.env.BOT_TOKEN : '';
        // const data = parse(init_data);

        const keyForInit = crypto.createHmac('sha256', 'WebAppData')
                           .update(botToken)
                           .digest();

        // 2단계: 위에서 생성한 키를 사용해 dataString에 대한 HMAC-SHA256 생성
        const computedHash = crypto.createHmac('sha256', keyForInit)
                                    .update(dataString)
                                    .digest('hex');
        if(computedHash !== receivedHash){
            console.log('not equal')
        } else {
            console.log('equal')
        }
        return computedHash === receivedHash;
    } catch (error) {
        console.log(error)
        throw error;
    }
};
  

function extractUserData(data: any): any {
    try {
        const params = new URLSearchParams(data);
        const userParam = params.get('user');
        
        if (!userParam) {
            console.log('User parameter not found');
            throw new CustomError(400, 'User parameter not found');
        }
        
        // URL 디코딩 후 JSON 파싱
        const userObj = JSON.parse(decodeURIComponent(userParam));
        return userObj;
    } catch (error) {
        console.error('Error extracting user data:', error);
        throw error;
    }
}


export const gameMain = async (data: any): Promise<null | any> => {

    const userCollection = db.collection('users');
    const assetCollection = db.collection('assets');
    const miningCollection = db.collection('minings');
    const chipCollection = db.collection('chips');
    const inviteCollection = db.collection('invites');
    const fassiveStorageCollection = db.collection('fassiveStorages');

    try {
        const secretKey = process.env.TELEGRAM_PUBLIC_KEY;

        if(!secretKey){
            throw new CustomError(400, 'secretKey not found');
        }

        const verifyResult = await verifyTelegramHash(data);
        if(!verifyResult){
            throw new CustomError(401, 'Unauthorized');
        }
        const userInit = extractUserData(data);
        const telegramUid = userInit.id;
        console.log('telegramUid=============', telegramUid);

 
       
        if (!telegramUid) {
            throw new CustomError(401, 'Unauthorized');
        }
        const user = await getUserByTelegramUid({ telegramUid: telegramUid });
        console.log('user', user);
        
        let userId!: string;

        if(user === null){
            // Create new user and related documents
            const invitee = await inviteCollection.where('guestId', '==', telegramUid).limit(1).get();
            if(invitee.docs.length > 0){
                await inviteCollection.doc(invitee.docs[0].id).update({accepted: true});
                const inviter = await userCollection.where('id', '==', invitee.docs[0].data().userId).limit(1).get();
                await updateUser(inviter.docs[0].id,{friends: inviter.docs[0].data().friends+1});
            }

            // create new user document
            const query = await userCollection.orderBy('userNumber', 'desc').limit(1).get()
            console.log('userNumber======', query.docs[0].data().userNumber)
            if(query.empty){
                throw new CustomError(400, 'User not found');
            }
            const newUserData: CreateUser = {
                userNumber: query.docs[0].data().userNumber+1,
                telegramUid: telegramUid,
                firstName: userInit.first_name? userInit.first_name : '',
                lastName: userInit.last_name? userInit.last_name : '',
                photo_url: userInit.photo_url? userInit.photo_url : '',
                username: userInit.username? userInit.username : '',
                friends: 0,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            }
            const newUser = await createUser(newUserData)
            userId = newUser.id;
            console.log('new user created with id', userId)
            
            try {
                // const docIds = await db.runTransaction(async (transaction) => {
                    // const query = userCollection.orderBy('userNumber', 'desc').limit(1)
                    // const querySnapshot = await transaction.get(query)
    
                    // let userCount:number=0;
                    // if(querySnapshot.empty){
                    //     throw new CustomError(400, 'User not found');
                    // }
                    // const userData = querySnapshot.docs[0].data()
                    // userCount = userData.userNumber;
                    // console.log('userCount', userCount)
                    // const newUserDoc = userCollection.doc();
                    // userId = newUserDoc.id;
                    // transaction.set(newUserDoc, {
                    //     userNumber: userCount+1,
                    //     telegramUid: telegramUid,
                    //     firstName: userInit.first_name,
                    //     lastName: userInit.last_name,
                    //     photo_url: userInit.photo_url,
                    //     username: userInit.username,
                    //     friends: 0,
                    //     createdAt: Timestamp.now(),
                    //     updatedAt: Timestamp.now()
                    // })
                    // const newUserDoc = await createUser({userNumber: userCount+1, telegramUid: telegramUid, firstName: userData.user.first_name, lastName: userData.user.last_name, photo_url: userData.user.photo_url, username: userData.user.username });
                // });
                // await db.runTransaction(async (transaction) => {    
                    const newAssetDoc = assetCollection.doc();
                    const newMiningDoc = miningCollection.doc();
                    const newChipDoc = chipCollection.doc();
                    const newFassiveStorageDoc = fassiveStorageCollection.doc();
                    // transaction.set(newUserDoc, {telegramUid: telegramUid, firstName: userData.user.first_name, lastName: userData.user.last_name, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
                    // transaction.set(newAssetDoc, { userId, pearl: 0, shell: 0, usdt: 0, box: 0, ads: 0, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
                    // transaction.set(newMiningDoc, { userId, level: 1, storage: 0, fassive: 0, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
                    // transaction.set(newChipDoc, { userId, roulette_round: 0, roulette_updatedAt: Timestamp.now(), createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
                    const assetData = {
                      userId,
                      pearl: 0,
                      shell: 0,
                      usdt: 0,
                      box: 0,
                      ads: 0,
                      createdAt: Timestamp.now(),
                      updatedAt: Timestamp.now(),
                    };

                    const miningData = {
                      userId,
                      level: 1,
                      storage: 0,
                      fassive: 0,
                      createdAt: Timestamp.now(),
                      updatedAt: Timestamp.now(),
                    };

                    const chipData = {
                      userId,
                      roulette_round: 0,
                      roulette_updatedAt: Timestamp.now(),
                      createdAt: Timestamp.now(),
                      updatedAt: Timestamp.now(),
                    };

                    const fassiveStorage = {
                        userId,
                        pearl:0,
                        createdAt: Timestamp.now(),
                        updatedAt: Timestamp.now()
                    }

                    // 비동기 작업 병렬 처리
                    await Promise.all([
                      newAssetDoc.set(assetData),
                      newMiningDoc.set(miningData),
                      newChipDoc.set(chipData),
                      newFassiveStorageDoc.set(fassiveStorage)
                    ]);
                    const asset = {
                      id: newAssetDoc.id,
                      ...assetData,
                    };

                    const mining = {
                      id: newMiningDoc.id,
                      ...miningData,
                    };

                    const chip = {
                      id: newChipDoc.id,
                      ...chipData,
                    };

                    console.log("new user documents created", asset, mining, chip);
                // });
            } catch (error) {
                console.error(error);
                throw error;
            }
            console.log('new user created');
        } else {
            userId = user.id;
            console.log('existing user', userId)
            const fassiveStorage = await findFassiveStorageByUserId(userId);
            if(!fassiveStorage){
                await createFassiveStorage({userId});
            }
            let data:any = {};
            if(userInit.first_name !== user.firstName && (userInit.first_name !== undefined )){
                data.firstName = userInit.first_name;
            } 
            if(userInit.last_name !== user.lastName && userInit.last_name !== undefined){
                data.lastName = userInit.last_name;
            }
            if(userInit.photo_url !== user.photo_url && userInit.photo_url !== undefined){
                data.photo_url = userInit.photo_url;
            }
            if(userInit.username !== user.username && userInit.username !== undefined){
                data.username = userInit.username;
            }
            await updateUser(userId, data);
        } 


        console.log('userId 1===============================', userId.slice(0,10));

        const access = await accessToken();
        console.log('access 1===============================', access.slice(0,10));
        const refresh = await refreshToken();
        console.log('refresh 1===============================', refresh.slice(0,10));
        const realUser = await getUserById(userId);
        console.log('realUser 1===============================', realUser?.id.slice(0,10));
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


export const getToken = async() => {
    try {
        const access = await accessToken();
        const refresh = await refreshToken();
        return {accessToken: access, refreshToken: refresh};
    } catch (error) {
        console.error(error);
        throw error;
    }
}



