import { db } from '../config/db'; // Firestore DB import
import { CreatePearlRaffle, FindPearlRaffleById,  CommonPearlRaffleResponse, UpdatePearlRaffle } from '../interfaces/pearlRaffleInterface';
import { Timestamp } from 'firebase-admin/firestore';
import { CustomError } from '../config/errHandler';


const pearlRaffleCollection = db.collection('pearlRaffles');

// export const createPearlRaffle = async (data: CreatePearlRaffle): Promise<PearlRaffleResponse> => {
//     try {
//         const now = new Date();
//         const dayOfWeek = now.getDay();
//         const startOfWeek = new Date(now);
//         startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
//         startOfWeek.setHours(0, 0, 0, 0);
//         const endOfWeek = new Date(startOfWeek);
//         endOfWeek.setDate(startOfWeek.getDate() + 6);
//         endOfWeek.setHours(23, 59, 59, 999);

//         const startTime = Timestamp.fromDate(startOfWeek);
//         const endTime = Timestamp.fromDate(endOfWeek);
//         const creatData: AddPearlRaffle = {
//             period: {start: startTime, end: endTime},
//             participants: 0,
//             winner: [],
//             entry_fee: data.entry_fee,
//             entry_type: data.entry_type,
//             reward: data.reward,
//             done: false,
//             createdAt: Timestamp.now(),
//         };
//         const docRef = await pearlRaffleCollection.add(creatData);
//         const newPearlRaffle = { id: docRef.id, ...creatData };
//         return newPearlRaffle;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

const lastRoundNumber = async (): Promise<number> => {
    try {
        const doc = await pearlRaffleCollection.orderBy('round_number', 'desc').limit(1).get();
        if(!doc.docs || doc.docs.length === 0) {
            return 0;
        }
        return doc.docs[0].data().round_number;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createPearlRaffle = async (data: CreatePearlRaffle): Promise<CommonPearlRaffleResponse> => {
    try {   
        const roundNumber = await lastRoundNumber() + 1;
        const createData: CreatePearlRaffle = {
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
        }
        const docRef = await pearlRaffleCollection.add(createData);
        const newPearlRaffle = { id: docRef.id, ...createData } as CommonPearlRaffleResponse;
        return newPearlRaffle;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPearlRaffleById = async (data: FindPearlRaffleById): Promise<CommonPearlRaffleResponse | null> => {
    try {
        const doc = await pearlRaffleCollection.doc(data.id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } as CommonPearlRaffleResponse : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


// export const getLatestPearlRaffle = async (): Promise<CommonPearlRaffleResponse | null> => {
//     try {
//         // const now = new Date(Date.now() - 3600*1000);
//         const now = new Date();
//         const dayOfWeek = now.getDay();
//         const startOfWeek = new Date(now);
//         startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
//         startOfWeek.setHours(0, 0, 0, 0);
//         const endOfWeek = new Date(startOfWeek);
//         endOfWeek.setDate(startOfWeek.getDate() + 6);
//         endOfWeek.setHours(23, 59, 59, 999);
//         const start: Timestamp = Timestamp.fromDate(startOfWeek);
//         const end: Timestamp = Timestamp.fromDate(endOfWeek);

//         const doc = await pearlRaffleCollection.where('period.start', '>=', start).where('period.end', '<=', end).orderBy('period.start', 'asc').orderBy('period.end', 'asc').orderBy('createdAt', 'desc').limit(1).get();
//         return doc.docs[0].exists ? { id: doc.docs[0].id, ...doc.docs[0].data() } as CommonPearlRaffleResponse : null;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

// 미리 만들어 놓은 래플 중에 가장 최신 것. 가장 가까운 것.
export const getLatestPearlRaffle = async (): Promise<CommonPearlRaffleResponse | null> => {
    try {
        const doc = await pearlRaffleCollection
        .where('indestructible', '==', false)
        .where('done', '==', false)
        .orderBy('period.start', 'asc')
        .limit(1)
        .get()
        if(doc.docs.length === 0) {
            return null;
        }
        return doc.docs[0].exists ? { id: doc.docs[0].id, ...doc.docs[0].data() } as CommonPearlRaffleResponse : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


//지금 진행 중인 래플
export const getBuyablePearlRaffle = async (): Promise<CommonPearlRaffleResponse | null> => {
    try {
        const doc = await pearlRaffleCollection
        .where('indestructible', '==', true)
        .where('done', '==', false)
        .limit(1)
        .get();
        if(!doc.docs || doc.docs.length === 0) {
            return null;
        }
        return  { id: doc.docs[0].id, ...doc.docs[0].data() } as CommonPearlRaffleResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

//끝난 래플 중에서 가장 가까운 것
export const getLastPearlRaffle = async (): Promise<CommonPearlRaffleResponse | null> => {
    try {
        const doc = await pearlRaffleCollection
        .where('indestructible', '==', true)
        .where('done', '==', true)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();
        if(!doc.docs || doc.docs.length === 0) {
            return null;
        }
        return  { id: doc.docs[0].id, ...doc.docs[0].data() } as CommonPearlRaffleResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// export const getSecondFromBackPearlRaffle = async (): Promise<CommonPearlRaffleResponse | null> => {
//     try {
//         const doc = await pearlRaffleCollection.orderBy('createdAt', 'desc').limit(2).get();
//         if(!doc.docs || doc.docs.length === 0) {
//             return null;
//         }
//         const done = doc.docs[0].data().done;
//         if (done) {
//             return null;
//         }
//         return doc.docs[1].exists ? { id: doc.docs[1].id, ...doc.docs[1].data() } as CommonPearlRaffleResponse : null;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };


export const updatePearlRaffle = async (data: UpdatePearlRaffle): Promise<void> => {
    try {
        const {id, ...updateData} = data;
        const raffle = await getPearlRaffleById({id});
        if(!raffle) throw new CustomError(404, 'Raffle not found');
        if(raffle.indestructible) throw new CustomError(400, 'Aleady started');
        if(raffle.done) throw new CustomError(400, 'Aleady done');
        await pearlRaffleCollection.doc(id).update(updateData);
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const insideUpdatePearlRaffle = async (data: UpdatePearlRaffle): Promise<void> => {
    try {
        const {id, ...updateData} = data;
        const raffle = await getPearlRaffleById({id});
        if(!raffle) throw new CustomError(404, 'Raffle not found');
        if(raffle.done) throw new CustomError(400, 'Aleady done');
        await pearlRaffleCollection.doc(id).update(updateData);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deletePearlRaffle = async (id: string): Promise<void> => {
    try {
        await pearlRaffleCollection.doc(id).delete();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllPearlRaffle = async (): Promise<number> => {
    try {
        const doc = await pearlRaffleCollection.where('indestructible', '==', true).where('done', '==', true).count().get();
        if(!doc){
            return 0;
        }
        const count = doc.data().count;
        return count;
    } catch (error) {
        console.error(error);
        throw error;
    }
};