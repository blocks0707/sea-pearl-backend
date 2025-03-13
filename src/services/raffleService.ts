import {createTransaction} from '../models/transactionModel';
import {getUserById} from '../models/userModel';
import {getAssetByUserId, updateAsset} from '../models/assetModel';
import {getLastPearlRaffle,getBuyablePearlRaffle, getAllPearlRaffle} from '../models/pearlRaffleModel';
import {createPearlRaffleLog, countPearlRaffleLogByRaffleId, findThisTimePearlRaffleByUserIdAndRaffleId} from '../models/pearlRaffleLogModel';
import {getLastShellRaffle, getBuyableShellRaffle, getAllShellRaffle} from '../models/shellRaffleModel';
import {createShellRaffleLog, findThisTimeShellRaffleByUserIdAndRaffleId, countShellRaffleLogByRaffleId} from '../models/shellRaffleLogModel';
import {pearlRaffleQuest, shellRaffleQuest} from '../services/questService';
import {CustomError} from '../config/errHandler';
import {Timestamp} from 'firebase-admin/firestore';


export const buyPearlRaffle = async (userId: string): Promise<any[]> => {
    try {
        const user = await getUserById(userId);
        if(user === null){
            throw new CustomError(404,'USER_NOT_FOUND');
        }

        const pearlRaffle = await getBuyablePearlRaffle();
        if (pearlRaffle === null) {
            throw new CustomError(404,'PEARL_RAFFLE_NOT_FOUND');
        }

        const asset = await getAssetByUserId({userId: user.id});
        if(!asset){
            throw new CustomError(404,'ASSET_NOT_FOUND');
        }

        if(asset.pearl < pearlRaffle.entry_fee){
            throw new CustomError(400, 'Not enough pearl');
        }

        const transaction = {
            from: user.id,
            to: pearlRaffle.id,
            fee_type: 'pearl',
            reason: `pearl_raffle_buy.${pearlRaffle.id}`,
            amount: pearlRaffle.entry_fee,
            createdAt: Timestamp.now(),
        };

        await createTransaction(transaction);
        
        await updateAsset(user.id, {pearl: asset.pearl - pearlRaffle.entry_fee});

       
        const pearlRaffleLog = {
            userId: user.id,
            pearlRaffleId: pearlRaffle.id
        } 

        await createPearlRaffleLog(pearlRaffleLog);


        const participant = await countPearlRaffleLogByRaffleId(pearlRaffle.id);

        const thisWeekLotto = await findThisTimePearlRaffleByUserIdAndRaffleId(user.id, pearlRaffle.id)

        const response = thisWeekLotto.map((item) => ({
            raffleId: item.pearlRaffleId,
            lotto_number: item.id,
            fee: pearlRaffle.entry_fee,
            start: pearlRaffle.period.start,
            end: pearlRaffle.period.end,
            participants: participant
        }));

        await pearlRaffleQuest(userId);
        
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const buyShellRaffle = async (userId: string): Promise<any[]> => {
    try {
        const user = await getUserById(userId);
        if(user === null){
            throw new CustomError(404,'USER_NOT_FOUND');
        }


        const shellRaffle = await getBuyableShellRaffle();
        if (shellRaffle === null) {
            throw new CustomError(404,'SHELL_RAFFLE_NOT_FOUND');
        }

        const asset = await getAssetByUserId({userId: user.id});
        if(!asset){
            throw new CustomError(404,'ASSET_NOT_FOUND');
        }

        if(asset.shell < shellRaffle.entry_fee){
            throw new CustomError(400, 'Not enough shell');
        }


        const transaction = {
            from: user.id,
            to: shellRaffle.id,
            fee_type: 'shell',
            reason: `shell_raffle_buy.${shellRaffle.id}`,
            amount: shellRaffle.entry_fee,
            createdAt: Timestamp.now(),
        };

        await createTransaction(transaction);
        await updateAsset(user.id, {shell: asset.shell - shellRaffle.entry_fee});

        // const filteredChip = chip.shell_raffle.filter((item) => item.raffleId === shellRaffle.id);

        // const chipRaffle = {
        //     raffleId: shellRaffle.id,
        //     lotto_number: shellRaffle.participants + 1,
        //     fee: shellRaffle.entry_fee,
        //     start: shellRaffle.period.start,
        //     end: shellRaffle.period.end,
        // };
        // await updateChip(user.id, {shell_raffle: [...filteredChip, chipRaffle]});

        // const newShellRaffle = await getChipByUserId({userId: user.id});
        // if(newShellRaffle === null){
        //     throw new CustomError(404,'CHIP_NOT_FOUND');
        // }        

        // await updateShellRaffle({id: shellRaffle.id, participants: shellRaffle.participants + 1});
        
        await createShellRaffleLog({userId: user.id, shellRaffleId: shellRaffle.id});

        const participant = await countShellRaffleLogByRaffleId(shellRaffle.id);

        const thisTimeLotto = await findThisTimeShellRaffleByUserIdAndRaffleId(user.id, shellRaffle.id)
        
        const response = thisTimeLotto.map((item) => ({
            raffleId: item.shellRaffleId,
            lotto_number: item.id,
            fee: shellRaffle.entry_fee,
            start: shellRaffle.period.start,
            end: shellRaffle.period.end,
            participants: participant
        }));

        await shellRaffleQuest(userId);
        
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getPearlRaffle = async (userId: string): Promise<any | null> => {
    try {
        const user = await getUserById(userId);
        if(user === null){
            throw new CustomError(404,'USER_NOT_FOUND');
        }
        //내가 이번 주 몇 개 샀는지 확인 용
        const buyablePearlRaffle = await getBuyablePearlRaffle();
        if (buyablePearlRaffle === null) {
            throw new CustomError(404,'PEARL_RAFFLE_NOT_FOUND');
        }

        //총 회자 확인 용
        const pearlRaffleCount = await getAllPearlRaffle();

        //지난주 로또 (지난 주 당첨자 확인용)
        const lastWeekPearlRaffle = await getLastPearlRaffle();  
        
        let lastWinners:any[] = [];

        //지난 주 로또 당첨자 데이터 추출
        lastWeekPearlRaffle?.winners.map((item) => {
            const reward_amount = lastWeekPearlRaffle.reward.find((reward) => reward.grade === item.grade)?.amount;
            lastWinners.push({name: item.name, grade: item.grade, amount: reward_amount});
        });


        //이번 회차 총 구매자 수
        const participants = await countPearlRaffleLogByRaffleId(buyablePearlRaffle.id);

        const thisWeekLotto = await findThisTimePearlRaffleByUserIdAndRaffleId(user.id, buyablePearlRaffle.id)
        console.log('이번주 로또', thisWeekLotto.length)
        return {
            raffleId: buyablePearlRaffle.id,
            round: pearlRaffleCount+1,
            entry_fee: buyablePearlRaffle.entry_fee,
            start: buyablePearlRaffle.period.start,
            end: buyablePearlRaffle.period.end,
            minimum_participants: buyablePearlRaffle.min_participants,
            participants: participants,
            reward: buyablePearlRaffle.reward,
            winner: lastWinners,
            participant_count: thisWeekLotto.length
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};




export const getShellRaffle = async (userId: string): Promise<any | null> => {
    try {
        const user = await getUserById(userId);
        if(user === null){
            throw new CustomError(404,'USER_NOT_FOUND');
        }
 

        const buyableShellRaffle = await getBuyableShellRaffle();
        if (buyableShellRaffle === null) {
            throw new CustomError(404,'SHELL_RAFFLE_NOT_FOUND');
        }


        const shellRaffleCount = await getAllShellRaffle();

        let lastWinners: any[] = [];

        const lastWeekShellRaffle = await getLastShellRaffle();
        lastWeekShellRaffle?.winners.map((item) => {
            const reward_amount = lastWeekShellRaffle.reward.find((reward) => reward.grade === item.grade)?.amount;
            lastWinners.push({name: item.name, grade: item.grade, amount: reward_amount});
        });

        const participants = await countShellRaffleLogByRaffleId(buyableShellRaffle.id);
        const thisWeekShellRaffle = await findThisTimeShellRaffleByUserIdAndRaffleId(user.id, buyableShellRaffle.id);
    
        return {
            raffleId: buyableShellRaffle.id,
            round: shellRaffleCount+1,
            entry_fee: buyableShellRaffle.entry_fee,
            start: buyableShellRaffle.period.start,
            end: buyableShellRaffle.period.end,
            minimum_participants: buyableShellRaffle.min_participants,
            participants: participants,
            reward: buyableShellRaffle.reward,
            winner: lastWinners,
            participant_count: thisWeekShellRaffle.length
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};
