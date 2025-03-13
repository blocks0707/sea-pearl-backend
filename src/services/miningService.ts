import {getAssetByUserId, updateAsset} from "../models/assetModel";
import {createTransaction, getLatestDoubleXBoostTransaction, getLatestfourXBoostTransaction, getAllBoostTransaction} from "../models/transactionModel";
import {getMiningByUserId, updateMining} from "../models/miningModel";
import {findFassiveStorageByUserId, updateFassiveStorage} from "../models/fassiveStorageModel";
//import {updateFassiveStorage} from "../models/fassiveStorageModel";
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
        const storage = await findFassiveStorageByUserId(userId);
        if(!storage){
            throw new CustomError(404, 'Fassive storage not found');
        }
        
        const {double, four, lastTime, lastBoost} = await getAllBoostTransaction(userId, storage.updatedAt as Timestamp);
    
        let now_fassive_storage: number = 0;
        const now = Timestamp.now();
        const updatedAt = storage.updatedAt as Timestamp;
        let diffInMilliseconds = now.toMillis() - updatedAt.toMillis() - (double * 60 * 60 * 1000) - (four * 60 * 60 * 1000);
        if(diffInMilliseconds<0){
            diffInMilliseconds = 0;
        }
        const elapsedMinutes = Math.floor(diffInMilliseconds / (1000 * 60));

        //여기서 fassive 가져온 다음 분당 얼마인지 계산.
        const fassiveMining = (25 + mining.fassive) / 60;
      
        //2배 부스트 동안의 패시브 채굴 양
        const doublexboost = double * fassiveMining * 60;
        //4배 부스트 동안의 패시브 채굴 양
        const fourxboost = four * fassiveMining * 60;
        //storage의 updatedAt 이후의 부스트 시간을 제외한 총 시간. 
        let total_elapsed_minutes = elapsedMinutes - (double * 60) - (four * 60);
        //마지막 시간과 마지막 부스트가 있을 경우 채굴량
        let lastBoostPearl = 0;
        if(lastTime && lastBoost){
            //toISOString을 Timestamp로 변환
            const lastTimeTimestamp = new Timestamp(Math.floor(new Date(lastTime).getTime()/1000), 0);
            const this_now = Timestamp.now();
            const lastDiffInMilliseconds = this_now.toMillis() - lastTimeTimestamp.toMillis();
            const lastElapsedMinutes = Math.floor(lastDiffInMilliseconds / (1000 * 60));
            
            if(lastBoost == '2xboost'){
                lastBoostPearl = fassiveMining * 2 * lastElapsedMinutes;
            } else if(lastBoost == '4xboost'){
                lastBoostPearl = fassiveMining * 4 * lastElapsedMinutes;
            }
            total_elapsed_minutes = total_elapsed_minutes - lastElapsedMinutes;
        }
        
        const preFassiveStorage = Math.floor(fassiveMining * total_elapsed_minutes);

        const resultStorage = preFassiveStorage + doublexboost + fourxboost + lastBoostPearl;
        
        if(resultStorage >= 1000 + mining.storage * 90){
            now_fassive_storage = 1000 + mining.storage * 90;
        } else {
            now_fassive_storage = resultStorage;
        }
        console.log('storage=====================', storage.id)
        await updateFassiveStorage(storage.id, {pearl: now_fassive_storage});

        return {
            storage_level: mining.storage,
            pearl_in_storage: now_fassive_storage,
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



export const movePearlToAsset = async (userId: string): Promise<boolean> => {
    try {
        const asset = await getAssetByUserId({userId});
        if (!asset) {
            throw new CustomError(404, 'Asset not found');
        }
        const fassiveStorage = await findFassiveStorageByUserId(userId);
        console.log('fassiveStorage=====================', fassiveStorage)
        if (!fassiveStorage) {
            throw new CustomError(404, 'Fassive storage not found');
        }

        const mining = await getMiningByUserId({userId});
        if (!mining) {
            throw new CustomError(404, 'Mining not found');
        }

        const storage = await findFassiveStorageByUserId(userId);
        if(!storage){
            throw new CustomError(404, 'Fassive storage not found');
        }
        
        const {double, four, lastTime, lastBoost} = await getAllBoostTransaction(userId, storage.updatedAt as Timestamp);
    
        let now_fassive_storage: number = 0;
        const now = Timestamp.now();
        const updatedAt = storage.updatedAt as Timestamp;
        let diffInMilliseconds = now.toMillis() - updatedAt.toMillis() - (double * 60 * 60 * 1000) - (four * 60 * 60 * 1000);
        if(diffInMilliseconds<0){
            diffInMilliseconds = 0;
        }
        const elapsedMinutes = Math.floor(diffInMilliseconds / (1000 * 60));

        //여기서 fassive 가져온 다음 분당 얼마인지 계산.
        const fassiveMining = (25 + mining.fassive) / 60;
      
        //2배 부스트 동안의 패시브 채굴 양
        const doublexboost = double * fassiveMining * 60;
        //4배 부스트 동안의 패시브 채굴 양
        const fourxboost = four * fassiveMining * 60;
        //storage의 updatedAt 이후의 부스트 시간을 제외한 총 시간. 
        let total_elapsed_minutes = elapsedMinutes - (double * 60) - (four * 60);
        //마지막 시간과 마지막 부스트가 있을 경우 채굴량
        let lastBoostPearl = 0;
        if(lastTime && lastBoost){
            //toISOString을 Timestamp로 변환
            const lastTimeTimestamp = new Timestamp(Math.floor(new Date(lastTime).getTime()/1000), 0);
            const this_now = Timestamp.now();
            const lastDiffInMilliseconds = this_now.toMillis() - lastTimeTimestamp.toMillis();
            const lastElapsedMinutes = Math.floor(lastDiffInMilliseconds / (1000 * 60));
            
            if(lastBoost == '2xboost'){
                lastBoostPearl = fassiveMining * 2 * lastElapsedMinutes;
            } else if(lastBoost == '4xboost'){
                lastBoostPearl = fassiveMining * 4 * lastElapsedMinutes;
            }
            total_elapsed_minutes = total_elapsed_minutes - lastElapsedMinutes;
        }
        
        const preFassiveStorage = Math.floor(fassiveMining * total_elapsed_minutes);

        const resultStorage = preFassiveStorage + doublexboost + fourxboost + lastBoostPearl;
        
        if(resultStorage >= 1000 + mining.storage * 90){
            now_fassive_storage = 1000 + mining.storage * 90;
        } else {
            now_fassive_storage = resultStorage;
        }
        console.log('now_fassive_storage=====================', now_fassive_storage)
      
        await updateFassiveStorage(fassiveStorage.id, {pearl: 0});
        const transaction = await createTransaction({
            fee_type: 'pearl',
            from: "company",
            to: userId,
            amount: now_fassive_storage,
            reason: 'fassive_storage_to_asset',
            createdAt: Timestamp.now(),
        });
        if (!transaction) {
            throw new CustomError(500, 'Transaction failed');
        }
        await updateAsset(userId, {pearl: asset.pearl + now_fassive_storage});
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


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