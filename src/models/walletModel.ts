import { db } from '../config/db'; // Firestore DB import
import { CreateWallet, WalletResponse,FindWalletById,FindWalletByUserId, DeleteWalletById,UpdateWalletAll } from '../interfaces/walletInterface';

import { Timestamp } from 'firebase-admin/firestore';

const walletCollection = db.collection('wallets');

export const createWallet = async (reqData: CreateWallet): Promise<WalletResponse> => {
    try {
        reqData.createdAt = Timestamp.now();
        reqData.updatedAt = Timestamp.now();
        const docRef = await walletCollection.add(reqData);
        const newWallet = { id: docRef.id, ...reqData };
        return newWallet;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getWalletById = async (reqData: FindWalletById): Promise<WalletResponse | null> => {
    try {
    const doc = await walletCollection.doc(reqData.id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } as WalletResponse : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getWalletByUserId = async (reqData: FindWalletByUserId): Promise<WalletResponse | null> => {
    try {
        const snapshot = await walletCollection.where('userId', '==', reqData.userId).limit(1).get();
        if(!snapshot.empty){
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() } as WalletResponse;
        }
        return null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateWallet = async (reqData: UpdateWalletAll): Promise<void> => {
    try {
        reqData.updatedAt = Timestamp.now();
        await walletCollection.doc(reqData.id).update(reqData);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteWallet = async (reqData: DeleteWalletById): Promise<void> => {
    try {
        await walletCollection.doc(reqData.id).delete();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
