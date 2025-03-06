import { db } from '../config/db'; // Firestore DB import
import { CreateRoulette, RouletteResponse, UpdateRoulette, FindRoulette } from '../interfaces/rouletteInterface';
import { Timestamp } from 'firebase-admin/firestore';
import { CustomError } from '../config/errHandler';

const rouletteCollection = db.collection('roulettes');

export const createRoulette = async (): Promise<boolean> => {
    try {
        const data: CreateRoulette = {
            entry: [],
            reward: [],
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        const docRef = await rouletteCollection.add(data);
        if (!docRef.id) {
            throw new CustomError(500, 'Failed to create roulette document', 'ERR_ROULETTE_CREATE_FAILED');
        }

        return true;
    } catch (error) {
        console.error('Error in createRoulette:', error);
        throw error;
    }
};

export const getRouletteById = async (data: FindRoulette): Promise<RouletteResponse | null> => {
    try {
        const doc = await rouletteCollection.doc(data.id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } as RouletteResponse : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getRouletteLatest = async (): Promise<RouletteResponse | null> => {
    try {
        const doc = await rouletteCollection.orderBy('createdAt', 'desc').limit(1).get();
        if (doc.empty) {
            return null;
        }
        const latestDoc = doc.docs[0];
        return { id: latestDoc.id, ...latestDoc.data() } as RouletteResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateRoulette = async (data: UpdateRoulette): Promise<void> => {
    try {
        data.updatedAt = Timestamp.now();
        const roulette = await getRouletteLatest();
        if (!roulette) {
            throw new CustomError(404, 'Roulette not found', 'ERR_ROULETTE_NOT_FOUND');
        }
        await rouletteCollection.doc(roulette.id).update(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};


