import { db } from "../config/db";
import { CreatePearlRaffleLog, ResponsePearlRaffleLog } from "../interfaces/pearlRaffleLogInterface";
import { Timestamp } from "firebase-admin/firestore";
import { CustomError } from "../config/errHandler";

const pearlRaffleLogCollection = db.collection('pearlRaffleLogs');

export const createPearlRaffleLog = async (data: CreatePearlRaffleLog): Promise<ResponsePearlRaffleLog> => {
    try {
        data.createdAt = Timestamp.now();
        const docRef = await pearlRaffleLogCollection.add(data);
        const newPearlRaffleLog = { id: docRef.id, ...data } as ResponsePearlRaffleLog;
        return newPearlRaffleLog;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const findPearlRaffleLogByUserId = async (userId: string): Promise<ResponsePearlRaffleLog[]> => {
    try {
        const querySnapshot = await pearlRaffleLogCollection.where('userId', '==', userId).get();
        if (querySnapshot.empty) {
            throw new CustomError(404, 'Pearl raffle log not found');
        }
        const pearlRaffleLogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ResponsePearlRaffleLog[];
        return pearlRaffleLogs;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const findPearlRaffleLogById = async (id: string): Promise<ResponsePearlRaffleLog | null> => {
    try {
        const doc = await pearlRaffleLogCollection.doc(id).get();
        if (!doc.exists) {
            throw new CustomError(404, 'Pearl raffle log not found');
        }
        const pearlRaffleLog = { id: doc.id, ...doc.data() } as ResponsePearlRaffleLog;
        return pearlRaffleLog;
    } catch (error) {
        console.error(error);
        throw error;
    }
};



export const findPearlRaffleLogByRaffleId = async (raffleId: string): Promise<ResponsePearlRaffleLog[]> => {
    try {
        const querySnapshot = await pearlRaffleLogCollection.where('raffleId', '==', raffleId).get();
        if (querySnapshot.empty) {
            throw new CustomError(404, 'Pearl raffle log not found');
        }
        const pearlRaffleLogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ResponsePearlRaffleLog[];
        return pearlRaffleLogs;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const findThisTimePearlRaffleByUserIdAndRaffleId = async (userId: string, raffleId: string): Promise<ResponsePearlRaffleLog[] | []> => {
    try {
        const thisTimePearlRaffleLog = await pearlRaffleLogCollection
            .where('userId', '==', userId)
            .where('pearlRaffleId', '==', raffleId)
            .get();

        if (thisTimePearlRaffleLog.empty) {
            return [];
        }
        const pearlRaffleLogs = thisTimePearlRaffleLog.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ResponsePearlRaffleLog[];
        return pearlRaffleLogs;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getAllPearlRaffleIdArray = async (pearlRaffleId: string): Promise<ResponsePearlRaffleLog[]> => {
    try {
        const querySnapshot = await pearlRaffleLogCollection.where('pearlRaffleId', '==', pearlRaffleId).get();
        const pearlRaffleLogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ResponsePearlRaffleLog[];
        return pearlRaffleLogs;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const deletePearlRaffleLogByLogId = async (logId: string): Promise<void> => {
    try {
        await pearlRaffleLogCollection.doc(logId).delete();
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const countPearlRaffleLogByRaffleId = async (raffleId: string): Promise<number> => {
    try {
        const ref = await pearlRaffleLogCollection.where('pearlRaffleId', '==', raffleId)
        const snapshot = await ref.count().get(); 
        return snapshot.data().count;
    } catch (error) {
        console.error(error);
        throw error;
    }
};