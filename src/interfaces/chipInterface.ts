import { Timestamp } from "firebase-admin/firestore";

export interface Chip {
    id: string;
    userId: string;
    roulette_round: number;
    roulette_updatedAt: Timestamp;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type CreateChip = Pick<Chip, 'userId'> & Partial<Omit<Chip, 'userId'>>;

export type ChipResponse = Chip;


export type FindChipByUserId = Pick<Chip, 'userId'>;



export type UpdateChip = Partial<Chip>;

export type DeleteChip = Pick<Chip, 'userId'> & Partial<Omit<Chip, 'userId'>>;