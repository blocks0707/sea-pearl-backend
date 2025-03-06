import { db } from '../config/db'; 
import { CreateRaffleBase, RaffleBaseResponse, UpdateRaffleBase } from '../interfaces/raffleBaseInterface';
import { Timestamp } from 'firebase-admin/firestore';
import { CustomError } from '../config/errHandler';

const raffleBaseCollection = db.collection('raffleBases');


export const createRaffleBase = async (): Promise<RaffleBaseResponse> => {
    try {
        const raffleBase = await raffleBaseCollection.limit(1).get();
        if (!raffleBase.empty) {
            throw new CustomError(400, 'Raffle base already exists');
        }
        const data: CreateRaffleBase = {
            shell_raffle_reward: [],
            shell_raffle_entry: {entry_type: 'shell', fee: 0},
            min_shell_raffle_winners: 0,
            pearl_raffle_reward: [],
            pearl_raffle_entry: {entry_type: 'pearl', fee: 0},
            min_pearl_raffle_winners: 0,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };
        const docRef = await raffleBaseCollection.add(data);
        const newRaffleBase = { id: docRef.id, ...data };
        return newRaffleBase;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const updateRaffleBase = async (data: UpdateRaffleBase): Promise<void> => {
    try {
        const raffleBase = await raffleBaseCollection.limit(1).get();
        if (raffleBase.empty) {
            throw new CustomError(404, 'Raffle base not found');
        }
        const updateData = {...data, updatedAt: Timestamp.now()};
        await raffleBaseCollection.doc(raffleBase.docs[0].id).update(updateData);
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getRaffleBase = async (): Promise<RaffleBaseResponse | null> => {
    try {
        const doc = await raffleBaseCollection.limit(1).get();
        return doc.docs[0].exists ? { id: doc.docs[0].id, ...doc.docs[0].data() } as RaffleBaseResponse : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};