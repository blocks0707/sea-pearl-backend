import { Timestamp } from "firebase-admin/firestore";

export interface PearlRaffleLog {
    id: string;
    userId: string;
    pearlRaffleId: string;
    createdAt: Timestamp;
}

export type CreatePearlRaffleLog = Pick<PearlRaffleLog, 'userId' | 'pearlRaffleId'> & Partial<Omit<PearlRaffleLog, 'userId' | 'pearlRaffleId'>>;

export type ResponsePearlRaffleLog = PearlRaffleLog;

