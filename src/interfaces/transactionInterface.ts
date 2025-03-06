import { Timestamp } from "firebase-admin/firestore";


export interface Transaction {
    id: string;
    amount: number;
    fee_type: string; //shell, pearl, usdt
    reason: string;  //win, lose, withdraw, tap
    from: string; //from Id or from Nickname
    to: string; //to Id or to Nickname
    createdAt: Timestamp;
}

export type CreateTransaction = Pick<Transaction, "fee_type" | "from" | "to" | "amount"> & Partial<Omit<Transaction, "fee_type" | "from" | "to" | "amount">>;

export type CreateTransactionResponse = Omit<Transaction, "reason" | "createdAt">;

export type TransactionResponse = Transaction;

export type FindTransactionById = Pick<Transaction, "id">;

export type FindTransactionByFrom = Pick<Transaction, "from">;

export type FindTransactionByTo = Pick<Transaction, "to">;

export type FindTransactionIt = Pick<Transaction, "from" | "to">;

export type DeleteTransactionById = Pick<Transaction, "id">;

