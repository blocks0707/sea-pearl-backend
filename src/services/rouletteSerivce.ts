import {getRouletteLatest} from '../models/rouletteModel';
import {getChipByUserId, rouletteUpdate} from '../models/chipModel';
import {getAssetByUserId, updateAsset} from '../models/assetModel';
import {createTransaction} from '../models/transactionModel';
import { Timestamp } from 'firebase-admin/firestore';
import { CustomError } from '../config/errHandler';


export const isToday = (data: Timestamp): Promise<boolean> => {
    return new Promise((resolve) => {
        const today = Timestamp.now();
        const result = data.toDate().getUTCFullYear() === today.toDate().getUTCFullYear() &&
            data.toDate().getUTCMonth() === today.toDate().getUTCMonth() &&
            data.toDate().getUTCDate() === today.toDate().getUTCDate();
        resolve(result);
    });
}


export const getPlay = async (userId: string): Promise<any> => {
    try {
        // 룰렛 데이터 가져오기
        const roulette = await getRouletteLatest();
        if(roulette === null){
            throw new CustomError(400, 'Roulette not found');
        }
        
        // userId로 개인 룰렛 데이터(chip) 가져오기
        const chip = await getChipByUserId({userId: userId});
        if(chip === null){
            throw new CustomError(400, 'Chip not found');
        }

        // userId로 개인 자산(asset) 가져오기
        const asset = await getAssetByUserId({userId: userId});
        if(asset === null){
            throw new CustomError(400, 'Asset not found');
        }

        let round:number = 0;
        // 개인 룰렛 데이터에서 roulette_updatedAt이 오늘이 아니면 roulette_round 0로 바꾸기
        if(!await isToday(chip.roulette_updatedAt)){
            round = 1;
        } else {
            // 개인 룰렛 데이터에서 roulette_updatedAt이 오늘이면 roulette_round가 entry length 미만일 경우에 1 더하기
            if(chip.roulette_round < roulette.entry.length){
                round = chip.roulette_round + 1;
            } else {
                round = roulette.entry.length;
            }
        }

        
       
        // 룰렛 데이터에서 개인 풀렛 데이터의 룰렛 라운드(1 더한것)과 일치하는 entry[i].round가 있는지 확인해서 가져오기
        const entry = roulette.entry.filter((item: any) => item.round === round);
        // 만약 개인 룰렛 데이터의 round가 20미만인데 entry[i].round와 일치하는 것이 없다면 커스텀 에러 반환
        if(entry.length === 0){
            throw new CustomError(400, 'Roulette not found');
        }
        
        // entry[i].round와 일치하는 것이 있는면 그 객체의 fee를 확인한 후에 개인 자산이 풀렛 데이터의 fee보다 작은지 확인
        // 개인 자산이 풀렛 데이터의 fee보다 작다면 커스텀 에러 반환
        // 개인 자산이 풀렛 데이터의 fee보다 큰다면 타입, amount,from은 개인 uid, to는 'company'를 넣고 transaction 생성
        // 개인 자산에서 트랜 잭션에 넣은 만큼을 차감
        if(entry[0].entry_type === 'usdt'){
            if(asset.usdt < entry[0].fee){
                throw new CustomError(400, 'Insufficient funds');
            }
            await createTransaction({fee_type: entry[0].entry_type, from: userId, to: 'company', amount: entry[0].fee, reason: 'roulette_fee'});
            await updateAsset(userId, {usdt: asset.usdt - entry[0].fee});
        } else if(entry[0].entry_type === 'shell'){
            if(asset.shell < entry[0].fee){
                throw new CustomError(400, 'Insufficient funds');
            }
            await createTransaction({fee_type: entry[0].entry_type, from: userId, to: 'company', amount: entry[0].fee, reason: 'roulette_fee'});
            await updateAsset(userId, {shell: asset.shell - entry[0].fee});
        } else if(entry[0].entry_type === 'pearl'){
            if(asset.pearl < entry[0].fee){
                throw new CustomError(400, 'Insufficient funds');
            }
            await createTransaction({fee_type: entry[0].entry_type, from: userId, to: 'company', amount: entry[0].fee, reason: 'roulette_fee'});
            await updateAsset(userId, {pearl: asset.pearl - entry[0].fee});
        } else {
            throw new CustomError(400, 'Invalid entry_type');
        }
        
     
        // 룰렛 데이터에서 reward배열을 가져온 후에, 랜덤으로 1~100사이의 수를 구하고 룰렛 데이터의 reward[i].chance의 누적보다 작거나 같은지 확인
        const random = Math.floor(Math.random() * 100);
        let sum_chance = 0;
        let rewardType: string = '';
        let rewardAmount: number = 0;
        for(let i = 0; i < roulette.reward.length; i++){
            sum_chance += roulette.reward[i].chance;
            if(random <= sum_chance){
                const reward = roulette.reward[i];
                if(reward.reward_type === 'usdt'){
                    rewardType = reward.reward_type;
                    rewardAmount = reward.amount;
                    await createTransaction({fee_type: reward.reward_type, from: 'company', to: userId, amount: reward.amount, reason: 'roulette_reward'});
                    await updateAsset(userId, {usdt: asset.usdt + reward.amount});
                } else if(reward.reward_type === 'shell'){
                    rewardType = reward.reward_type;
                    rewardAmount = reward.amount;
                    await createTransaction({fee_type: reward.reward_type, from: 'company', to: userId, amount: reward.amount, reason: 'roulette_reward'});
                    await updateAsset(userId, {shell: asset.shell + reward.amount});
                } else if(reward.reward_type === 'pearl'){
                    rewardType = reward.reward_type;
                    rewardAmount = reward.amount;
                    await createTransaction({fee_type: reward.reward_type, from: 'company', to: userId, amount: reward.amount, reason: 'roulette_reward'});
                    await updateAsset(userId, {pearl: asset.pearl + reward.amount});
                } else {
                    throw new CustomError(400, 'Invalid reward_type');
                }
                break;
            } 
        }
        // 당첨이 되면 타입, amount, from은 'company', to는 개인 uid를 넣고 transaction 생성
        // 개인 자산에서 트랜 잭션에 넣은 만큼을 증감
        console.log('마지막 round', round);
        await rouletteUpdate({userId: userId, roulette_round: round});

 

        return {type:rewardType, amount:rewardAmount};
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getNowEntry = async (userId: string): Promise<{nowEntryType: string, nowEntryFee: number, enabledTry: boolean}> => {
    try {
        //룰렛 환경 세팅 가져옴
        const roulette = await getRouletteLatest();

        //룰렛 환경 세팅 값이 없으면 에러.
        if(!roulette){
            throw new CustomError(404, 'Roulette not found');
        }

        //유저의 chip 세팅 가져옴. 여기에 룰렛 라운드도 있고 업데이트 날짜도 있음.
        const chip = await getChipByUserId({userId: userId});
        if(chip === null){
            throw new CustomError(400, 'Chip not found');
        }

        let round = 0;
        // 개인 룰렛 데이터에서 roulette_updatedAt이 오늘이 아니면 roulette_round 0로 바꾸기
        if(!await isToday(chip.roulette_updatedAt)){
            round = 0;
        } else {
            // 개인 룰렛 데이터에서 roulette_updatedAt이 오늘이면 roulette_round가 아이템 수보다 미만일 경우에 1 더하기
            if(chip.roulette_round < roulette.entry.length){
                round = chip.roulette_round + 1;
            } else {
                round = roulette.entry.length;
            }
        }

        // const nowEntry = roulette.entry.filter((item: any) => item.round === round+1);
        const nowEntry = roulette.entry.filter((item: any) => {
            if(round < roulette.entry.length){
                return item.round === round+1;
            } else {
                return item.round === round;
            }
        });
        console.log('nowEntry===================================', nowEntry)
        let nowEntryType = '';
        let nowEntryFee = 0;
        if(nowEntry.length === 0){
            throw new CustomError(400, 'Roulette not found');
        }

        if(nowEntry[0].fee === 0){
            nowEntryType = '무료';
            nowEntryFee = 0;
        } else {
            nowEntryType = nowEntry[0].entry_type;
            nowEntryFee = nowEntry[0].fee;
        }

        let enabledTry = false;
        const asset = await getAssetByUserId({userId: userId});
        if(!asset) throw new CustomError(400, 'Asset not found');
        if(nowEntryType === 'usdt'){
            if(asset.usdt >= nowEntryFee){
                enabledTry = true;
            }
        } else if(nowEntryType === 'shell'){
            if(asset.shell >= nowEntryFee){
                enabledTry = true;
            }
        } else if(nowEntryType === 'pearl'){
            if(asset.pearl >= nowEntryFee){
                enabledTry = true;
            }
        }
        return {nowEntryType:nowEntryType, nowEntryFee:nowEntryFee, enabledTry:enabledTry};
    } catch (error) {
        console.error(error);
        throw error;
    }
};