import {getFreeboxLast} from "../models/freeboxModel";
import {createTransaction} from "../models/transactionModel";
import {updateAsset, getAssetByUserId} from "../models/assetModel";
import { createAds, getLastAd } from "../models/adsModel";
import {freeboxQuest} from "../services/questService";
import { CustomError } from "../config/errHandler";



const isToday = async(data:any): Promise<boolean> => {

    return new Promise((resolve) => {
        const today = new Date();
        const result = data.toDate().getUTCFullYear() === today.getUTCFullYear() &&
            data.toDate().getUTCMonth() === today.getUTCMonth() &&
            data.toDate().getUTCDate() === today.getUTCDate();
        resolve(result);
    });
}



export const openFreebox = async (userId: string): Promise<any> => {
    try {
        const setting = await getFreeboxLast();
        if (setting === null) {
            throw new CustomError(404,'Freebox not found');
        }

        const random = Math.floor(Math.random() * 100);

        let firstscore = 0;
        let bonusType = '';
        let bonusAmount = 0;
        for(const reward of setting.reward) {
            firstscore += reward.chance;
            if (random <= firstscore) {
                bonusType = reward.reward_type;
                bonusAmount = reward.amount;
                break; 
            }
        }
   
        const tr = await createTransaction({fee_type: bonusType, from: 'company', to: userId, amount: bonusAmount, reason: 'box_open'});
        const asset = await getAssetByUserId({userId: userId});
        console.log('에셋이 나와야 한다. ', asset);
        const lastAdLog = await getLastAd(userId);
        if(lastAdLog === null){
            throw new CustomError(404,'Ad not found');
        }
        if(!asset){
            throw new CustomError(404,'Asset not found');
        }
        let newBox:number = 0;
        if(!await isToday(lastAdLog.createdAt)){
            newBox = 1;
        } else {
            if(asset.box>29){
                throw new CustomError(400,'Box full');
            }
            newBox = asset.box + 1;
        }
        let lastscore=0;
        const lastAds = asset.ads;
        console.log('lastads=================', lastAds)
        if(bonusType === 'shell'){
            lastscore = asset.shell;
        } else if(bonusType === 'pearl'){
            lastscore = asset.pearl;
        } else if(bonusType === 'usdt'){
            lastscore = asset.usdt;
        }
        await updateAsset(userId, {userId: tr.to, box: newBox, [bonusType]: lastscore + bonusAmount, ads: lastAds + 1});
        // const ads_round = await getAdByUserId({userId: userId});
        // if(ads_round === null){
        //     throw new CustomError(404,'Ad not found');
        // }
        await createAds({userId: userId, type: 'video', which: 'freebox'});
        await freeboxQuest(userId);
        
        return {
            reward_type: bonusType,
            amount: bonusAmount,
            rest: 30 - newBox
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};



export const getRestBox = async (userId: string): Promise<number> => {
    try {
        const asset = await getAssetByUserId({userId: userId});
        console.log('에셋이 나와야 한다. 미리보기', asset);
        if(!asset){
            throw new CustomError(404,'Asset not found');
        }
        const lastAds = await getLastAd(userId);
        if(lastAds === null){
            return 30;
        }
        let newBox:number = 0;
        if(!await isToday(lastAds.createdAt)){
            newBox = 0;
        } else {
            if(asset.box>29){
                newBox = 30;
            }
            newBox = asset.box
        }
        
        return 30 - newBox;
    } catch (error) {
        console.error(error);
        throw error;
    }
}