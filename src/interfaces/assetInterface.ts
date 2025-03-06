import { Timestamp } from "firebase-admin/firestore";

export interface Asset {
    id: string;
    ads: number;
    box: number;
    shell: number;
    pearl: number;
    usdt: number;
    userId: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type CreateAsset = Pick<Asset, "userId"> & Partial<Omit<Asset, "userId">>;
    
export type AssetResponse = Pick<Asset, "id"> & Partial<Omit<Asset, "id">>;

export type commonResponse = Asset;

export type UpdateAsset = Partial<Asset>;

export type FindAssetByUserId = Pick<Asset, "userId">;

export type FindAssetById = Pick<Asset, "id">;

export type AssetType = 'shell' | 'pearl' | 'usdt';



