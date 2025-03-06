import { db } from '../config/db'; // Firestore DB import
import { CreateFreebox, FreeboxResponse, FindFreebox, UpdateFreebox } from '../interfaces/freeboxInterface';
import { Timestamp } from 'firebase-admin/firestore';
import { CustomError } from '../config/errHandler';

const freeboxCollection = db.collection('freeboxes');

export const createFreebox = async (data: CreateFreebox): Promise<FreeboxResponse> => {
    try {
        const allFreebox = await freeboxCollection.get();
        if(allFreebox.size !==0) {
            throw new CustomError(400, 'Freebox already exists');
        }
        data.createdAt = Timestamp.now() as Timestamp;
        const docRef = await freeboxCollection.add(data);
        const newFreebox: FreeboxResponse = { id: docRef.id, reward: data.reward, createdAt: data.createdAt };
        return newFreebox;
    } catch (error) {
        console.error(error);
        throw error;
    }
};



export const getFreeboxById = async (data: FindFreebox): Promise<FreeboxResponse | null> => {
    try {
        const doc = await freeboxCollection.doc(data.id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } as FreeboxResponse : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getFreeboxLast = async (): Promise<FreeboxResponse | null> => {
    try {
        const doc = await freeboxCollection.orderBy('createdAt', 'desc').limit(1).get();
        return doc.docs[0].exists ? { id: doc.docs[0].id, ...doc.docs[0].data() } as FreeboxResponse : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const updateFreebox = async (data: UpdateFreebox): Promise<void> => {
    try {
        await freeboxCollection.doc(data.id).update(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
}




export const deleteFreebox = async (id: string): Promise<void> => {
    try {
        await freeboxCollection.doc(id).delete();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
