import { Timestamp } from "firebase-admin/firestore";

//mining boost
export interface Ad {
    id: string;
    userId: string;
    type: string;
    which: string;
    createdAt: Timestamp;
}


export type CreateAd = Pick<Ad, "userId"> & Partial<Omit<Ad, "userId">>;

export type AdResponse = Ad;

export type UpdateAdById = Pick<Ad, "id" > & Partial<Omit<Ad, "id">>;

export type FindAdByUserId = Pick<Ad, "userId">;

export type FindAdById = Pick<Ad, "id">;

export type DeleteAdById = Pick<Ad, "id">;