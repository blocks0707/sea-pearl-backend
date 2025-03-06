import { Timestamp } from "firebase-admin/firestore";

export interface Freebox {
    id: string;
    reward: {amount: number, reward_type: string, chance: number}[]; // {amount: "pearl 2000", chance: 5}
    createdAt: Timestamp;
}

export type CreateFreebox = Pick<Freebox, "reward"> & Partial<Omit<Freebox, "reward">>;

export type UpdateFreebox = Pick<Freebox, "id"> & Partial<Omit<Freebox, "id">>;

export type FreeboxResponse = Freebox;

export type FindFreebox = Pick<Freebox, "id">;

