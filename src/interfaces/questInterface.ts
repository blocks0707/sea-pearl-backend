import { Timestamp } from "firebase-admin/firestore";

export interface QuestCollection {
  id: string;
  projectId: string;
  questLogo: string;
  questNumber: number;
  title: string;
  purpose: string;
  reward: {type: string, amount: number}[];
  url: string;
  resetCycle: string;   // daily, weekly, monthly, none
  roundInCycle: number;
  resetCount: number;
  period: {start: Timestamp, end: Timestamp}
  maxParticipants: number;
  enabled: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateQuest = Pick<QuestCollection, "projectId"> & Partial<Omit<QuestCollection, "projectId">>

export type QuestResponse = Pick<QuestCollection, "id"> & Partial<Omit<QuestCollection, "id">>;

export type UpdateQuest = Pick<QuestCollection, "id"> & Partial<Omit<QuestCollection, "id" | "projectId">>

export type FindQuestById = Pick<QuestCollection, "id">

export type FindQuestByProjectId = Pick<QuestCollection, "projectId">

export type DeleteQuestById = Pick<QuestCollection, "id">

