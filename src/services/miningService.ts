import {getAssetByUserId, updateAsset} from "../models/assetModel";
import {createTransaction, getLatestDoubleXBoostTransaction, getLatestfourXBoostTransaction} from "../models/transactionModel";
import {getMiningByUserId, updateMining} from "../models/miningModel";
import {CustomError} from "../config/errHandler";
import {Timestamp} from "firebase-admin/firestore";



export const getMiningData = async (userId: string): Promise<any> => {
    try {
        const mining = await getMiningByUserId({userId});
        if (!mining) {
            throw new CustomError(404, 'Mining not found');
        }

        let storageUpgradeFee: number = 0;
        if(mining.storage < 100){
            storageUpgradeFee = (mining.storage + 1) * 90;
        } else {
            storageUpgradeFee = 0;
        }

        let miningUpgradeFee: number = 0;
        if(mining.fassive < 100){
            miningUpgradeFee = mining.fassive + 1;
        } else {
            miningUpgradeFee = 0;
        }
        
        return {
            storage_level: mining.storage,
            now_storage: 1000 + mining.storage * 90,
            storageUpgradeFee: storageUpgradeFee,
            fassive_level: mining.fassive,
            now_fassive: 25 + mining.fassive,
            miningUpgradeFee: miningUpgradeFee,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};




export const miningUpgrade = async (userId: string): Promise<boolean> => {
    try {
        const asset = await getAssetByUserId({userId});
        if (!asset) {
            throw new CustomError(404, 'Asset not found');
        }
        const mining = await getMiningByUserId({userId});
        if (!mining) {
            throw new CustomError(404, 'Mining not found');
        }

        if(asset.shell < (mining.fassive +1)){
            throw new CustomError(400, 'Not enough shell');
        }

        const transaction = await createTransaction({
            fee_type: 'shell',
            from: userId,
            to: 'company',
            amount: mining.fassive + 1,
            reason: 'mining_upgrade',
            createdAt: Timestamp.now(),
        });
        if (!transaction) {
            throw new CustomError(500, 'Transaction failed');
        }
        await updateAsset(userId, {shell: asset.shell - (mining.fassive + 1)});
        await updateMining(userId, {fassive: mining.fassive + 1}); 
        return true;   
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const storageUpgrade = async (userId: string): Promise<boolean> => {
    try {
        const asset = await getAssetByUserId({userId});
        if (!asset) {
            throw new CustomError(404, 'Asset not found');
        }
        const mining = await getMiningByUserId({userId});
        if (!mining) {
            throw new CustomError(404, 'Mining not found');
        }

        if(asset.shell < (mining.storage +1)*90){
            throw new CustomError(400, 'Not enough shell');
        }

        const transaction = await createTransaction({
            fee_type: 'shell',
            from: userId,
            to: 'company',
            amount: (mining.storage +1)*90,
            reason: 'storage_upgrade',
            createdAt: Timestamp.now(),
        });
        if (!transaction) {
            throw new CustomError(500, 'Transaction failed');
        }
        await updateAsset(userId, {shell: asset.shell - ((mining.storage +1)*90)});
        await updateMining(userId, {storage: mining.storage + 1});
        return true;    
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getBoostStatus = async (userId: string): Promise<any> => {
    try {
        const mining = await getMiningByUserId({userId});
        if (!mining) {
            throw new CustomError(404, 'Mining not found');
        }
        
        let reason = '';
        let start: Timestamp | null = null;
        const lastDoubleXBoostTransaction = await getLatestDoubleXBoostTransaction(userId);
        if(lastDoubleXBoostTransaction){
            reason = lastDoubleXBoostTransaction.reason;
            const {seconds, nanoseconds} = lastDoubleXBoostTransaction.createdAt;
            const start_time = new Timestamp(seconds, nanoseconds);
            const now = Timestamp.now();

            // start와 현재 시간의 차이를 밀리초 단위로 계산
            const timeDifferenceMillis = (now.seconds - start_time.seconds) * 1000 + (now.nanoseconds - start_time.nanoseconds) / 1000000;

            // 1시간 = 3600초 = 3600000 밀리초
            const oneHourMillis = 3600 * 1000;

            // 1시간 이내인지 확인
            const isWithinOneHour = timeDifferenceMillis <= oneHourMillis;

            if (isWithinOneHour) {
                reason = lastDoubleXBoostTransaction.reason;
                start = start_time;
            } else {
                reason = '';
                start = null;
            }
        } else {
            reason = '';
            start = null;
        }

        return {
            boost_type: reason,
            boost_start: start,
            doublexboost_before: `25 + ${mining.fassive}`,
            doublexboost_after: `50 + ${mining.fassive}`,
            fourxboost_before: `25 + ${mining.fassive}`,
            fourxboost_after: `100 + ${mining.fassive}`,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const doublexboost = async (userId: string): Promise<any> => {
    try {
        const asset = await getAssetByUserId({userId});
        if (!asset) {
            throw new CustomError(404, 'Asset not found');
        }
        console.log('asset 확인 완료')
        if(asset.pearl < 100){
            throw new CustomError(400, 'Not enough pearl');
        }

        const mining_data = await getMiningByUserId({userId});
        if (!mining_data) {
            throw new CustomError(404, 'Mining not found');
        }
        console.log('mining 확인 완료')
        const lastTransaction = await getLatestDoubleXBoostTransaction(userId);
        console.log('lastTransaction 확인 완료')
        const createdAt = lastTransaction ? lastTransaction.createdAt.toDate().getTime() : null;
        const now = new Date();
        const oneHour = 60 * 60 * 1000;

        if (lastTransaction && createdAt !== null && now.getTime() - createdAt < oneHour) {
            throw new CustomError(400, 'You can only double boost once per hour');
        }

        const boostNow = Timestamp.now();

        const transaction = await createTransaction({
            fee_type: 'pearl',
            from: userId,
            to: 'company',
            amount: 100,
            reason: '2xboost',
            createdAt: boostNow
        });

        if (!transaction) {
            throw new CustomError(500, 'Transaction failed');
        }
        console.log('transaction 확인 완료')
        await updateAsset(userId, {pearl: asset.pearl - 100});
        console.log('asset 수정 완료')
        return {
            mining_amount: (25 + mining_data.fassive) * 2,
            boost_endAt: boostNow.toDate().getTime() + 60 * 60 * 1000
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const fourxboost = async (userId: string): Promise<any> => {
    try {
        const asset = await getAssetByUserId({userId});
        if (!asset) {
            throw new CustomError(404, 'Asset not found');
        }
        
        if(asset.shell < 200){
            throw new CustomError(400, 'Not enough pearl');
        }

        const mining_data = await getMiningByUserId({userId});
        if (!mining_data) {
            throw new CustomError(404, 'Mining not found');
        }

        const lastTransaction = await getLatestfourXBoostTransaction(userId);
        const createdAt = lastTransaction ? lastTransaction.createdAt.toDate().getTime() : null;
        const now = new Date();
        const oneHour = 60 * 60 * 1000;

        if (lastTransaction && createdAt !== null && now.getTime() - createdAt < oneHour) {
            throw new CustomError(400, 'You can only double boost once per hour');
        }

        const boostNow = Timestamp.now();

        const transaction = await createTransaction({
            fee_type: 'shell',
            from: userId,
            to: 'company',
            amount: 200,
            reason: '4xboost',
            createdAt: boostNow
        });

        if (!transaction) {
            throw new CustomError(500, 'Transaction failed');
        }

        await updateAsset(userId, {shell: asset.shell - 200});
        return {
            mining_amount: (25 + mining_data.fassive) * 4,
            boost_endAt: boostNow.toDate().getTime() + 60 * 60 * 1000
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
};