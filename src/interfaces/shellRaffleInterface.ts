import { Timestamp } from "firebase-admin/firestore";

export interface ShellRaffle {
    id: string;
    round_number: number;
    period: {start: Timestamp, end: Timestamp};
    participants: number;
    winners: {name: string, lotto_number: string, grade: number}[];
    reward: {amount: number, reward_type: string, grade: number, winners: number}[];
    entry_fee: number;
    entry_type: string;
    min_participants: number;
    indestructible: boolean;
    done: boolean;
    createdAt: Timestamp;
}


export type AddShellRaffle = Omit<ShellRaffle, "id">;

export type CreateShellRaffle = Pick<ShellRaffle, 'entry_fee' | 'entry_type' | 'reward' | 'period' | 'min_participants'> & Partial<Pick<ShellRaffle, 'round_number' | 'participants' | 'indestructible' | 'done' | 'createdAt' | 'winners'>>;

export type CreateShellRaffleResponse = Pick<ShellRaffle, "id"> & Partial<Omit<ShellRaffle, "id">>;
    
export type ShellRaffleResponse = ShellRaffle;

export type FindShellRaffleById = Pick<ShellRaffle, "id">;

export type UpdateShellRaffle = Pick<ShellRaffle, "id"> & Partial<Omit<ShellRaffle, "id">>;

export type DeleteShellRaffleById = Pick<ShellRaffle, "id">;