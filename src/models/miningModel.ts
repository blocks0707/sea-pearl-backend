import { db } from '../config/db'; // Firestore DB import
import {  UpdateMining, FindMiningByUserId, commonMiningResponse } from '../interfaces/miningInterface';
import { Timestamp } from 'firebase-admin/firestore';
import { CustomError } from '../config/errHandler';

const miningCollection = db.collection('minings');

// export const createMining = async (data: CreateMining): Promise<MiningResponse> => {
//     try {
//         data.createdAt = Timestamp.now();
//         data.updatedAt = Timestamp.now();
//         const docRef = await miningCollection.add(data);
//         const newMining = { id: docRef.id, ...data };
//         return newMining;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

export const getMiningById = async (id: string): Promise<commonMiningResponse | null> => {
    try {
        const doc = await miningCollection.doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } as commonMiningResponse : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getMiningByUserId = async (data: FindMiningByUserId): Promise<commonMiningResponse | null> => {
    try {
        const doc = await miningCollection.where('userId', '==', data.userId).limit(1).get();
        return doc.docs[0].exists ? { id: doc.docs[0].id, ...doc.docs[0].data() } as commonMiningResponse : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateMining = async (userId: string, data: UpdateMining): Promise<void> => {
    try {
        data.updatedAt = Timestamp.now();
        const mining = await miningCollection.where('userId', '==', userId).limit(1).get();
        if (mining.empty) {
            throw new CustomError(404, 'Mining not found');
        }
        await miningCollection.doc(mining.docs[0].id).update(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteMining = async (id: string): Promise<void> => {
    try {
        await miningCollection.doc(id).delete();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
