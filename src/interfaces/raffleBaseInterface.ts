import { Timestamp } from "firebase-admin/firestore";

export interface RaffleBaseInterface {
    id: string;
    shell_raffle_reward: {amount: number,reward_type: string, grade: number, winners: number}[];
    shell_raffle_entry: {entry_type: string, fee: number}
    min_shell_raffle_winners: number;
    pearl_raffle_reward: {amount: number, reward_type: string, grade: number, winners: number}[];
    pearl_raffle_entry: {entry_type: string, fee: number}
    min_pearl_raffle_winners: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type CreateRaffleBase = Omit<RaffleBaseInterface, 'id'>;

export type UpdateRaffleBase = Partial<Pick<RaffleBaseInterface, 'shell_raffle_reward' | 'shell_raffle_entry' | 'pearl_raffle_reward' | 'pearl_raffle_entry' |'updatedAt'>>;

export type GetRaffleBase = Pick<RaffleBaseInterface, 'id' | 'shell_raffle_reward' | 'shell_raffle_entry' | 'pearl_raffle_reward' | 'pearl_raffle_entry' | 'min_shell_raffle_winners' | 'min_pearl_raffle_winners' | 'createdAt' | 'updatedAt'>;

export type RaffleBaseResponse = GetRaffleBase;