import { db } from '../config/db';
import { QuestLogResponse, CreateQuestLog, UpdateQuestLog } from '../interfaces/questLogInterface';
import { Timestamp } from 'firebase-admin/firestore';
import { CustomError } from '../config/errHandler';

const QUEST_LOGS_COLLECTION = 'questLogs';

export const createQuestLog = async (logData: CreateQuestLog): Promise<string> => {
  try {
    const logRef = await db.collection(QUEST_LOGS_COLLECTION).add({
      ...logData,
      createdAt: Timestamp.now(),
    });
    return logRef.id;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findQuestLogsByUser = async (userId: string): Promise<QuestLogResponse[]> => {
  try {
    const snapshot = await db.collection(QUEST_LOGS_COLLECTION)
      .where('userId', '==', userId)
      .get();
      
    if (snapshot.empty) {
      throw new CustomError(404, 'No quest logs found for this user');
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as QuestLogResponse);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findAllQuestLogsByUserAndQuest = async (userId: string, questId: string): Promise<QuestLogResponse[]> => {
  try {
    const snapshot = await db.collection(QUEST_LOGS_COLLECTION)
      .where('userId', '==', userId)
      .where('questId', '==', questId)
      .get();
      
    if (snapshot.empty) {
      throw new CustomError(404, 'No quest logs found for this user and quest');
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as QuestLogResponse);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findQuestLogByUserAndQuestAndLatest = async (userId: string, questId: string): Promise<QuestLogResponse | null> => {
  try {
    const snapshot = await db.collection(QUEST_LOGS_COLLECTION)
      .where('userId', '==', userId)
      .where('questId', '==', questId)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();
      
    if (snapshot.empty) {
      return null;
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as QuestLogResponse)[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const findQuestLogsByUserIdAndQuestAndCreatedAt = async (userId: string, questId: string, startDate: Date, endDate: Date): Promise<QuestLogResponse[] | []> => {
  try {
    if(startDate ===null && endDate === null) return ([] as QuestLogResponse[]);
    const start = Timestamp.fromDate(startDate);
    const end = Timestamp.fromDate(endDate);
    const snapshot = await db.collection(QUEST_LOGS_COLLECTION)
      .where('userId', '==', userId)
      .where('questId', '==', questId)
      .where('createdAt', '>=', start)
      .where('createdAt', '<', end)
      .get();
      
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as QuestLogResponse);
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export const findNoneQuestLogsByUserIdAndQuest = async (userId: string, questId: string): Promise<QuestLogResponse[] | []> => {
  try {
    const snapshot = await db.collection(QUEST_LOGS_COLLECTION)
      .where('userId', '==', userId)
      .where('questId', '==', questId)
      .get();
      
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as QuestLogResponse);
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export const findQuestLogsByUserIdAndQuestAndCreatedAtLastOne = async (userId: string, questId: string, startDate: Date, endDate: Date): Promise<QuestLogResponse | null> => {
  try {
    if(startDate ===null && endDate === null) throw new CustomError(400, 'Start and end date cannot be null');
    const start = Timestamp.fromDate(startDate);
    const end = Timestamp.fromDate(endDate);
    const snapshot = await db.collection(QUEST_LOGS_COLLECTION)
      .where('userId', '==', userId)
      .where('questId', '==', questId)
      .where('progressData.completed', '==', true)
      .where('createdAt', '>=', start)
      .where('createdAt', '<', end)
      .limit(1)
      .get();
      
    if (snapshot.empty) {
      return null;
    }
    
    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    } as QuestLogResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const findNoneQuestLogsByUserIdAndQuestLastOne = async (userId: string, questId: string): Promise<QuestLogResponse | null> => {
  try {
    const snapshot = await db.collection(QUEST_LOGS_COLLECTION)
      .where('userId', '==', userId)
      .where('questId', '==', questId)
      .where('progressData.completed', '==', true)
      .limit(1)
      .get();
      
    if (snapshot.empty) {
      return null;
    }
    
    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    } as QuestLogResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export const findQuestLogsByQuest = async (questId: string): Promise<QuestLogResponse[]> => {
  try {
    const snapshot = await db.collection(QUEST_LOGS_COLLECTION)
      .where('questId', '==', questId)
      .get();
      
    if (snapshot.empty) {
      throw new CustomError(404, 'No quest logs found for this quest');
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as QuestLogResponse);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findQuestLogsByProject = async (projectId: string): Promise<QuestLogResponse[]> => {
  try {
    const snapshot = await db.collection(QUEST_LOGS_COLLECTION)
      .where('projectId', '==', projectId)
      .get();
      
    if (snapshot.empty) {
      throw new CustomError(404, 'No quest logs found for this project');
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as QuestLogResponse);
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const updateQuestLog = async (logData: UpdateQuestLog): Promise<void> => {
  try {
    await db.collection(QUEST_LOGS_COLLECTION).doc(logData.id).update(logData);
  } catch (error) {
    console.error(error);
    throw error;
  }
};



export const countCompletedQuestLogsByQuest = async (questId: string): Promise<number> => {
  try {
    const snapshot = await db.collection(QUEST_LOGS_COLLECTION)
      .where('questId', '==', questId)
      .where('completed', '==', true)
      .count()
      .get();
      
    return snapshot.data().count || 0;
  } catch (error) {
    console.error(error);
    throw error;
  }
}