import { db } from '../config/db'; // Firestore DB import
import { CreateTransaction, CreateTransactionResponse,TransactionResponse, FindTransactionById, DeleteTransactionById } from '../interfaces/transactionInterface';
import { Timestamp } from 'firebase-admin/firestore';

const transactionCollection = db.collection('transactions');

export const createTransaction = async (data: CreateTransaction): Promise<CreateTransactionResponse> => {
    try {
        data.createdAt = Timestamp.now();
        const docRef = await transactionCollection.add(data);
        const newTransaction = { id: docRef.id, ...data };
        return newTransaction;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getTransactionById = async (reqData: FindTransactionById): Promise<TransactionResponse | null> => {
    try {
        const doc = await transactionCollection.doc(reqData.id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } as TransactionResponse : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};



export const getTransactionByReason = async (raffle_id: string, reason: string): Promise<TransactionResponse[]> => {
    try {
        const query = await transactionCollection.where('raffle_id', '==', raffle_id).where('reason', '==', reason).get();
        return query.docs.map((doc) => ({ id: doc.id, ...doc.data() } as TransactionResponse));
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getTransactionByReasonAndFrom = async (reason: string, from: string): Promise<TransactionResponse[]> => {
    try {
        const query = await transactionCollection.where('reason', '==', reason).where('from', '==', from).get();
        return query.docs.map((doc) => ({ id: doc.id, ...doc.data() } as TransactionResponse));
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const getAllTransactions = async (userId: string): Promise<TransactionResponse[]> => {
    try {
        const fromQuery = await transactionCollection.where('from', '==', userId).get();
        const toQuery = await transactionCollection.where('to', '==', userId).get();

        const transactions = [
            ...fromQuery.docs.map((doc) => ({ id: doc.id, ...doc.data() } as TransactionResponse)),
            ...toQuery.docs.map((doc) => ({ id: doc.id, ...doc.data() } as TransactionResponse)),
        ];

        const sortedTransactions = transactions.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        return sortedTransactions;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getLatestDoubleXBoostTransaction = async (userId: string): Promise<TransactionResponse | null> => {
    try {
        const query = await transactionCollection.where('from', '==', userId).where('reason', 'in', ['2xboost', '4xboost']).orderBy('createdAt', 'desc').limit(1).get();
        if (query.empty) {
            return null;
        }
        return { id: query.docs[0].id, ...query.docs[0].data() } as TransactionResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getLatestfourXBoostTransaction = async (userId: string): Promise<TransactionResponse | null> => {
    try {
        const query = await transactionCollection.where('from', '==', userId).where('reason', 'in', ['2xboost', '4xboost']).orderBy('createdAt', 'desc').limit(1).get();
        if (query.empty) {
            return null;
        }
        return { id: query.docs[0].id, ...query.docs[0].data() } as TransactionResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getAllBoostTransaction = async (userId: string, time:Timestamp): Promise<any> => {
    try {
        const oneHourAgo = new Timestamp(time.seconds - 3600, time.nanoseconds);
        const query = await transactionCollection.where('from', '==', userId).where('reason', 'in', ['2xboost', '4xboost']).where('createdAt', '>=', time).where('createdAt', '<=', oneHourAgo).get();
        const all = await transactionCollection.where('from', '==', userId).where('reason', 'in', ['2xboost', '4xboost']).get();

        let double = 0;
        let four = 0;
        let lastBoost = '';
        let lastTime = '';

        if(query.docs.length == all.docs.length){
            query.docs.forEach((doc) => {
                if(doc.data().reason == '2xboost'){
                    double++;
                }else{
                    four++;
                }
            })
        } else {
            query.docs.forEach((doc) => {
                if(doc.data().reason == '2xboost'){
                    double++;
                }else{
                    four++;
                }
            })
            const lastTransaction = all.docs[all.docs.length - 1];
            lastTime = lastTransaction.data().createdAt.toDate().toISOString();
            lastBoost = lastTransaction.data().reason;
        }

        return {double, four, lastTime, lastBoost};
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteTransaction = async (reqData: DeleteTransactionById): Promise<void> => {
    try {
        await transactionCollection.doc(reqData.id).delete();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
