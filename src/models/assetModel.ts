import { db } from '../config/db'; // Firestore DB import
import { commonResponse, UpdateAsset, FindAssetByUserId } from '../interfaces/assetInterface';
import { Timestamp } from 'firebase-admin/firestore';

const assetCollection = db.collection('assets');

// export const createAsset = async (data: CreateAsset): Promise<AssetResponse> => {
//     try {
//         data.createdAt = Timestamp.now();
//         data.updatedAt = Timestamp.now();
//         const docRef = await assetCollection.add(data);
//         const newAsset = { id: docRef.id, ...data };
//         return newAsset;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

export const getAssetById = async (id: string): Promise<commonResponse | null> => {
    try {
        const doc = await assetCollection.doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } as commonResponse : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAssetByUserId = async (data: FindAssetByUserId): Promise<commonResponse | null> => {
    try {
        const doc = await assetCollection.where('userId', '==', data.userId).limit(1).get();
        if(!doc.empty){
            return { id: doc.docs[0].id, ...doc.docs[0].data() } as commonResponse;
        }
        return null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateAsset = async (userId: string, data: UpdateAsset): Promise<void> => {
    try {
        data.updatedAt = Timestamp.now();
        const doc = await assetCollection.where('userId', '==', userId).limit(1).get();
        if (doc.empty) {
            throw new Error('Asset not found');
        }
        await assetCollection.doc(doc.docs[0].id).update(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteAsset = async (id: string): Promise<void> => {
    try {
        await assetCollection.doc(id).delete();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
