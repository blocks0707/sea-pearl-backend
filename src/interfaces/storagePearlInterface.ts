import { Timestamp } from "firebase-admin/firestore";


export interface FassiveStorage {
    id: string;
    userId: string;
    pearl: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};


export type CreateFassiveStorage = Pick<FassiveStorage, "userId"> & Partial<Omit<FassiveStorage, 'userId'>>;

export type UpdateFassiveStorage = Partial<Omit<FassiveStorage, 'id'>>;

export type FindFassiveStorageByUserId = Pick<FassiveStorage, "userId">;

export type FindFassiveStorageById = Pick<FassiveStorage, "id">;