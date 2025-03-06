import { db } from '../config/db';
import { UpdateChip, ChipResponse, FindChipByUserId } from '../interfaces/chipInterface';
import { Timestamp } from 'firebase-admin/firestore';
import { CustomError } from '../config/errHandler';

const chipCollection = db.collection('chips');




export const rouletteUpdate = async (data: UpdateChip): Promise<void> => {
    try {
        const chip = await chipCollection.where('userId', '==', data.userId).limit(1).get();

        data.updatedAt = Timestamp.now();
        data.roulette_updatedAt = Timestamp.now();
        await chipCollection.doc(chip.docs[0].id).update(data);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getChipByUserId = async (data: FindChipByUserId): Promise<ChipResponse | null> => {
    try {
        const doc = await chipCollection.where('userId', '==', data.userId).limit(1).get();
        return doc.docs[0].exists ? { id: doc.docs[0].id, ...doc.docs[0].data() } as ChipResponse : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const updateChip = async (userId: string, data: UpdateChip): Promise<void> => {
    try {
        const chip = await chipCollection.where('userId', '==', userId).limit(1).get();
        if (chip.empty) {
            throw new CustomError(404, 'Chip not found');
        }
        data.updatedAt = Timestamp.now();
        
        await chipCollection.doc(chip.docs[0].id).update(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const updateRaffle = async (id: string, data: UpdateChip): Promise<void> => {
    try {
        data.updatedAt = Timestamp.now();
        await chipCollection.doc(id).update(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getChipByRaffle = async (raffle_type: string, lotto_number: number): Promise<ChipResponse | null> => {
    try {
        const doc = await chipCollection.where('raffle_type', '==', raffle_type).where('lotto_number', '==', lotto_number).limit(1).get();
        return doc.docs[0].exists ? { id: doc.docs[0].id, ...doc.docs[0].data() } as ChipResponse : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};