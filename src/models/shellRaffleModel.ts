import { db } from '../config/db'; // Firestore DB import
import { CreateShellRaffle, CreateShellRaffleResponse, ShellRaffleResponse, FindShellRaffleById, DeleteShellRaffleById, UpdateShellRaffle } from '../interfaces/shellRaffleInterface';
import { Timestamp } from 'firebase-admin/firestore';
import { CustomError } from '../config/errHandler';


const shellRaffleCollection = db.collection('shellRaffles');


const lastRoundNumber = async (): Promise<number> => {
    try {
        const doc = await shellRaffleCollection.orderBy('round_number', 'desc').limit(1).get();
        if(!doc.docs || doc.docs.length === 0) {
            return 0;
        }
        return doc.docs[0].data().round_number;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const createShellRaffle = async (data: CreateShellRaffle): Promise<CreateShellRaffleResponse> => {
    try {
        const roundNumber = await lastRoundNumber() + 1;
        const makeData: CreateShellRaffle = {
            round_number: roundNumber,
            period: {start: data.period.start, end: data.period.end},
            participants: 0,
            min_participants: data.min_participants,
            winners: [],
            entry_fee: data.entry_fee,
            entry_type: data.entry_type,
            reward: data.reward,
            indestructible: false,
            done: false,
            createdAt: Timestamp.now(),
        };
        const docRef = await shellRaffleCollection.add(makeData);
        const newShellRaffle = { id: docRef.id, ...makeData };
        return newShellRaffle;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getShellRaffleById = async (data: FindShellRaffleById): Promise<ShellRaffleResponse | null> => {
    try {
        const doc = await shellRaffleCollection.doc(data.id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } as ShellRaffleResponse : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};



export const getLatestShellRaffle = async (): Promise<ShellRaffleResponse | null> => {
    try {
        const doc = await shellRaffleCollection
        .where('indestructible', '==', false)
        .where('done', '==', false)
        .orderBy('createdAt', 'asc')
        .limit(1)
        .get();

        if(!doc.docs || doc.docs.length === 0) {
            return null;
        }
        return { id: doc.docs[0].id, ...doc.docs[0].data() } as ShellRaffleResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


// export const getSecondFromBackShellRaffle = async (): Promise<ShellRaffleResponse | null> => {
//     try {
//         const doc = await shellRaffleCollection.orderBy('createdAt', 'desc').limit(2).get();
//         if(!doc.docs || doc.docs.length === 0) {
//             return null;
//         }
//         const done = doc.docs[0].data().done;
//         if (done) {
//             return null;
//         }
//         return doc.docs[1].exists ? { id: doc.docs[1].id, ...doc.docs[1].data() } as ShellRaffleResponse : null;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };


export const getBuyableShellRaffle = async (): Promise<ShellRaffleResponse | null> => {
    try {
        const doc = await shellRaffleCollection
        .where('indestructible', '==', true)
        .where('done', '==', false)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();
        if(!doc.docs || doc.docs.length === 0) {
            return null;
        }
        return  { id: doc.docs[0].id, ...doc.docs[0].data() } as ShellRaffleResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getLastShellRaffle = async (): Promise<ShellRaffleResponse | null> => {
    try {
        const doc = await shellRaffleCollection
        .where('indestructible', '==', true)
        .where('done', '==', true)
        .orderBy('createdAt', 'desc')
        .limit(1).get();
        if(!doc.docs || doc.docs.length === 0) {
            return null;
        }
        return  { id: doc.docs[0].id, ...doc.docs[0].data() } as ShellRaffleResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const updateShellRaffle = async (data: UpdateShellRaffle): Promise<void> => {
    try {
        const {id, ...updateData} = data;
        const raffle = await getShellRaffleById({id});
        if(!raffle) {
            throw new CustomError(404, 'Raffle not found');
        }
        if(raffle.indestructible) {
            throw new CustomError(400, 'Aleady started');
        }
        if(raffle.done) {
            throw new CustomError(400, 'Aleady done');
        }
        await shellRaffleCollection.doc(id).update(updateData);
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const deleteShellRaffle = async (data: DeleteShellRaffleById): Promise<void> => {
    try {
        await shellRaffleCollection.doc(data.id).delete();
    } catch (error) {
        console.error(error);
        throw error;
    }
};



export const getAllShellRaffle = async (): Promise<number> => {
    try {
        const doc = await shellRaffleCollection.get();
        const count = doc.size;
        return count;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
