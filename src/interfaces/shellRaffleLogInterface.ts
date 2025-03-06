import { Timestamp } from "firebase-admin/firestore";


export interface ShellRaffleLog {
    id: string;
    shellRaffleId: string;
    userId: string;
    createdAt: Timestamp;
}

export type CreateShellRaffleLog = Pick<ShellRaffleLog, 'shellRaffleId' | 'userId'> & Partial<Omit<ShellRaffleLog, 'shellRaffleId' | 'userId'>>;

export type ShellRaffleLogResponse = ShellRaffleLog;

export type FindShellRaffleLogById = Pick<ShellRaffleLog, 'id'>;

export type FindShellRaffleLogByShellRaffleId = Pick<ShellRaffleLog, 'shellRaffleId'>;

export type FindShellRaffleLogByUserId = Pick<ShellRaffleLog, 'userId'>;

export type DeleteShellRaffleLog = Pick<ShellRaffleLog, 'id'>;
