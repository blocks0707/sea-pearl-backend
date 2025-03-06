import { Timestamp } from "firebase-admin/firestore";

export interface QuestLogCollection {
  id: string;
  userId: string;
  projectId: string;
  questId: string;
  progressData?: Record<string, any>;
  completed: boolean;
  createdAt: Timestamp;
}


export type CreateQuestLog = Pick<QuestLogCollection, "userId" | "projectId" | "questId"> & Partial<Omit<QuestLogCollection, "userId" | "projectId" | "questId">>;

export type QuestLogResponse = QuestLogCollection

export type findQuestLogByUserId = Pick<QuestLogCollection, "userId">;

export type findQuestLogByQuestId = Pick<QuestLogCollection, "questId">;

export type findQuestLogByProjectId = Pick<QuestLogCollection, "projectId">;

export type UpdateQuestLog = Pick<QuestLogCollection, "id"> & Partial<Omit<QuestLogCollection, "id">>;