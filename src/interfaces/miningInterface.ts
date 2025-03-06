import { Timestamp } from "firebase-admin/firestore";

export interface Mining {
    id: string;
    userId: string;
    storage: number;
    fassive: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}


export type CreateMining = Pick<Mining, "userId"> & Partial<Omit<Mining, "userId">>;

export type commonMiningResponse = Mining;

export type MiningResponse = Pick<Mining, "id"> & Partial<Omit<Mining, "id">>;

export type UpdateMining = Partial<Mining>;

export type FindMiningByUserId = Pick<Mining, "userId">;

export type FindMiningById = Pick<Mining, "id">;