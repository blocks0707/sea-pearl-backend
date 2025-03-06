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



export const deleteTransaction = async (reqData: DeleteTransactionById): Promise<void> => {
    try {
        await transactionCollection.doc(reqData.id).delete();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
