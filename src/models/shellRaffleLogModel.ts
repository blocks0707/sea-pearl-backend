import { db } from '../config/db';
import { CreateShellRaffleLog, ShellRaffleLogResponse } from '../interfaces/shellRaffleLogInterface';
import { Timestamp } from 'firebase-admin/firestore';
import { CustomError } from '../config/errHandler';

const shellRaffleLogCollection = db.collection('shellRaffleLogs');

export const createShellRaffleLog = async (data: CreateShellRaffleLog): Promise<ShellRaffleLogResponse> => {
    try {
        data.createdAt = Timestamp.now();
        const docRef = await shellRaffleLogCollection.add(data);
        const newShellRaffleLog = { id: docRef.id, ...data } as ShellRaffleLogResponse;
        return newShellRaffleLog;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const findShellRaffleLogById = async (id: string): Promise<ShellRaffleLogResponse | null> => {
    try {
        const doc = await shellRaffleLogCollection.doc(id).get();
        if (!doc.exists) {
            throw new CustomError(404, 'Shell raffle log not found');
        }
        const shellRaffleLog = { id: doc.id, ...doc.data() } as ShellRaffleLogResponse;
        return shellRaffleLog;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const findShellRaffleLogByRaffleId = async (raffleId: string): Promise<ShellRaffleLogResponse[]> => {
    try {
        const querySnapshot = await shellRaffleLogCollection.where('raffleId', '==', raffleId).get();
        if (querySnapshot.empty) {
            throw new CustomError(404, 'Shell raffle log not found');
        }
        const shellRaffleLogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ShellRaffleLogResponse[];
        return shellRaffleLogs;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const findThisTimeShellRaffleByUserIdAndRaffleId = async (userId: string, raffleId: string): Promise<ShellRaffleLogResponse[] | []> => {
    try {
        const querySnapshot = await shellRaffleLogCollection
            .where('userId', '==', userId)
            .where('shellRaffleId', '==', raffleId)
            .get();

        if (querySnapshot.empty) {
            return [];
        }
        const shellRaffleLogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ShellRaffleLogResponse[];
        return shellRaffleLogs;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getAllShellRaffleIdArray = async (shellRaffleId: string): Promise<ShellRaffleLogResponse[]> => {
    try {
        const querySnapshot = await shellRaffleLogCollection.where('shellRaffleId', '==', shellRaffleId).get();
        const raffleIds = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ShellRaffleLogResponse[];
        return raffleIds;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const deleteShellRaffleLogByLogId = async (logId: string): Promise<void> => {
    try {
        await shellRaffleLogCollection.doc(logId).delete();
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};



export const countShellRaffleLogByRaffleId = async (raffleId: string): Promise<number> => {
    try {
        const ref = await shellRaffleLogCollection.where('shellRaffleId', '==', raffleId)
        const snapshot = await ref.count().get(); 
        return snapshot.data().count;
    } catch (error) {
        console.error(error);
        throw error;
    }
};