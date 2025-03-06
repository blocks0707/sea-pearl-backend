import { Timestamp } from "firebase-admin/firestore";

export interface Wallet {
    id: string,
    userId: string
    address: string,
    balance: number,
    createdAt: Timestamp
    updatedAt: Timestamp
}

export type CreateWallet = Pick<Wallet, "userId" | "address"> & Partial<Omit<Wallet, "userId" | "address">>;

export type WalletResponse = Pick<Wallet, "id"> & Partial<Omit<Wallet, "id">>;

export type UpdateWallet = Pick<Wallet, "userId"> & Partial<Omit<Wallet, "userId">>;

export type UpdateWalletAll = Pick<Wallet, "id"> & Partial<Omit<Wallet, "id">>;

export type FindWalletById = Pick<Wallet, "id">;

export type FindWalletByUserId = Pick<Wallet, "userId">;

export type DeleteWalletById = Pick<Wallet, "id">;