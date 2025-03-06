import { db } from '../config/db'; // Firestore DB import
import { CreateQuest, QuestResponse, UpdateQuest,FindQuestById, DeleteQuestById } from '../interfaces/questInterface';
import { Timestamp } from 'firebase-admin/firestore';
import { CustomError } from '../config/errHandler';

const questCollection = db.collection('quests');

export const createQuest = async (data: CreateQuest): Promise<QuestResponse> => {
    try {
        const docRef = await questCollection.add({
            ...data,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        const newQuest = { id: docRef.id, ...data };
        return newQuest;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getQuestById = async (data: FindQuestById): Promise<QuestResponse> => {
    try {
        const doc = await questCollection.doc(data.id).get();
        if(!doc.exists) throw new CustomError(404, 'Quest not found');
        return { id: doc.id, ...doc.data() } as QuestResponse 
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getAllQuests = async (): Promise<QuestResponse[]> => {
    try {
        const snapshot = await questCollection.where('enabled', '==', true).get();
        if (snapshot.empty) {
            throw new CustomError(404, 'No quests found');
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as QuestResponse);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateQuest = async (data: UpdateQuest): Promise<void> => {
    try {
        data.updatedAt = Timestamp.now();
        await questCollection.doc(data.id).update(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteQuest = async (data: DeleteQuestById): Promise<void> => {
    try {
        await questCollection.doc(data.id).delete();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const findQuestsByUserId = async (userId: string): Promise<QuestResponse[]> => {
    try {
        const snapshot = await questCollection
            .where('userId', '==', userId)
            .get();
        
        if (snapshot.empty) {
            throw new CustomError(404, 'No quests found for this user');
        }
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as QuestResponse);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const findQuestsByProjectId = async (projectId: string): Promise<QuestResponse[] | []> => {
    try {
        const snapshot = await questCollection
            .where('projectId', '==', projectId)
            .orderBy('questNumber', 'asc')
            .get();
   
            
        if (snapshot.empty) {
            return [];
        }
        
        return await snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as QuestResponse);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const findQuestByProjectIdAndUserId = async (userId: string, projectId: string,): Promise<QuestResponse[]> => {
    try {
        const snapshot = await questCollection
            .where('projectId', '==', projectId)
            .where('userId', '==', userId)
            .get();
            
        if (snapshot.empty) {
            throw new CustomError(404, 'No quest found for this project and user');
        }
        
        return await snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as QuestResponse);
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getAllQuestNumberByProjectId = async (projectId: string): Promise<number> => {
    try {
        const snapshot = await questCollection.where('projectId', '==', projectId).get();
        return snapshot.docs.length;
    } catch (error) {
        console.error(error);
        throw error;
    }
};