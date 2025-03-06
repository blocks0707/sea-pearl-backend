import { Timestamp } from "firebase-admin/firestore";

export interface Roulette {
    id: string;
    entry: {entry_type: string, fee: number, round: number}[];
    reward: {amount: number, reward_type: string, chance: number}[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type CreateRoulette = Pick<Roulette, "entry" | "reward"> & Partial<Omit<Roulette, "entry" | "reward">>;

export type RouletteResponse = Roulette;

export type reward = "shell" | "pearl" | "usdt";

export type UpdateRoulette = Partial<Roulette>;

export type FindRoulette = Pick<Roulette, "id">;