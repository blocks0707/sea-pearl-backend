import { getAssetByUserId, updateAsset } from "../models/assetModel";
import { createWallet, getWalletByUserId, updateWallet } from "../models/walletModel";
import { CustomError } from "../config/errHandler";
import { createTransaction, getAllTransactions } from "../models/transactionModel";


export const walletMain = async (userId: string): Promise<any> => {
    try {
        const asset = await getAssetByUserId({userId: userId});
        if(!asset){
            throw new CustomError(404, 'Asset not found');
        }

        const wallet = await getWalletByUserId({userId: userId});
        if(!wallet){
            return {walletAddress: '', usdt: asset.usdt};
        }

        return {walletAddress: wallet.address, usdt: asset.usdt};
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const withdraw = async (userId: string, amount: number): Promise<boolean> => {
    try {
        const wallet = await getWalletByUserId({userId: userId});
        console.log('wallet=========================',wallet)
        if(!wallet) throw new CustomError(404, 'Wallet not found in withdraw');
        if(!wallet.address) throw new CustomError(400, 'Wallet address not found in withdraw');

        const asset = await getAssetByUserId({userId: userId});
        if(!asset){
            throw new CustomError(404, 'Asset not found');
        }
        if(asset.usdt < amount || amount < 10){
            throw new CustomError(400, 'Not enough balance');
        }

        await createTransaction({fee_type: 'usdt', from: 'company', to: userId, amount: amount, reason: 'withdraw'});
        await updateAsset(userId, {usdt: asset.usdt - amount});
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};



export const walletHistory = async (userId: string): Promise<any[]> => {
    try {
        const transactions = await getAllTransactions(userId);
        return transactions;
    } catch (error) {
        console.error(error);
        throw error;
    }
};



export const walletAddressUpdate = async (userId: string, address: string): Promise<boolean> => {
    try {
        const wallet = await getWalletByUserId({userId: userId});
        if(!wallet){
            await createWallet({userId: userId, address: address});
        } else {
            await updateWallet({id: wallet.id, address: address});
        }
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};