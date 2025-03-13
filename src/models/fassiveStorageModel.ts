import { db } from '../config/db';
import {CreateFassiveStorage, UpdateFassiveStorage } from "../interfaces/storagePearlInterface"
import { Timestamp } from 'firebase-admin/firestore';
import { CustomError } from '../config/errHandler';


const fassiveStorageCollection = db.collection('fassiveStorage');

export const createFassiveStorage = async (fassiveStorage: CreateFassiveStorage) => {
    try{
        fassiveStorage.createdAt = Timestamp.now();
        fassiveStorage.updatedAt = Timestamp.now();
        fassiveStorage.pearl = 0;
        const fassiveStorageRef = await fassiveStorageCollection.add(fassiveStorage);
        return fassiveStorageRef.id;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const updateFassiveStorage = async (id: string, fassiveStorage: UpdateFassiveStorage) => {
    try{
        fassiveStorage.updatedAt = Timestamp.now();
        await fassiveStorageCollection.doc(id).update(fassiveStorage);
    } catch (error) {
        console.error(error);
        throw error;
    }
}



export const findFassiveStorageByUserId = async (userId: string):Promise<any | null> => {
    try{
        const fassiveStorageRef = await fassiveStorageCollection.where('userId', '==', userId).limit(1).get();
        if (fassiveStorageRef.empty) {
            return null;
        }
        const doc = fassiveStorageRef.docs[0];
        return {
            id: doc.id,
            ...doc.data()
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const findFassiveStorageById = async (id: string) => {
    try{
        const fassiveStorageRef = await fassiveStorageCollection.doc(id).get();
        if (!fassiveStorageRef.exists) {
            throw new CustomError(404, 'Fassive storage not found');
        }
        return fassiveStorageRef.data();
    } catch (error) {
        console.error(error);
        throw error;
    }
}