import { db } from '../config/db'; // Firestore DB import
import { CreateAd, AdResponse, FindAdByUserId} from '../interfaces/adsInterface';
import { Timestamp } from 'firebase-admin/firestore';
import { CustomError } from '../config/errHandler';

const adsCollection = db.collection('ads');

export const createAds = async (data: CreateAd): Promise<AdResponse> => {
    try {
        data.createdAt = Timestamp.now();
        const docRef = await adsCollection.add(data);
        const newAds = { id: docRef.id, userId: data.userId, type: data.type, which: data.which, createdAt: data.createdAt} as AdResponse;
        return newAds;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAdById = async (id: string): Promise<AdResponse | null> => {
    try {
        const doc = await adsCollection.doc(id).get();
        if(!doc.exists){
            throw new CustomError(404, 'Ad not found');
        }
        const ad = { id: doc.id, ...doc.data() } as AdResponse;
        return ad;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getAdByUserId = async (data: FindAdByUserId): Promise<AdResponse | null> => {
    try {
        const querySnapshot = await adsCollection.where('userId', '==', data.userId).get();
        if(querySnapshot.empty){
            return null;
        }
        const ads = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as AdResponse;
        return ads;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getLastAd = async (userId:string): Promise<AdResponse | null> => {
    try {
        const querySnapshot = await adsCollection.where('userId', '==', userId).orderBy('createdAt', 'desc').limit(1).get();
        if(querySnapshot.empty){
            return null;
        }
        const ads = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as AdResponse;
        return ads;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


// export const updateAds = async (data: UpdateAdById): Promise<void> => {
//     try {
//         const updatData = {
//             round: data.round,
//             updatedAt: Timestamp.now()
//         }
//         await adsCollection.doc(data.id).update(updatData);
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };



export const deleteAds = async (id: string): Promise<void> => {
    try {
        await adsCollection.doc(id).delete();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
