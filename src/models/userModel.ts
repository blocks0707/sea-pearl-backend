import { db } from '../config/db'; // Firestore DB import
import { CreateUser, UserResponse, UpdateUserRequest, FindUserByTelegramUid } from '../interfaces/userInterface';
import { Timestamp } from 'firebase-admin/firestore';
import { TelegramQuery } from '../interfaces/userInterface';
import crypto from 'crypto';
import {CustomError} from '../config/errHandler';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const userCollection = db.collection('users');


export const verifyTelegram = async (query: TelegramQuery): Promise<boolean> => {
    try {
        const telegramQuery: TelegramQuery = query;
        if(!telegramQuery){
            throw new CustomError(401, 'Unauthorized');
        }

        const secretKey = crypto.createHash('sha256').update(process.env.SECRET_KEY || '').digest();

        const dataCheck = Object.keys(telegramQuery)
        .filter(key => key !== 'hash')
        .sort()
        .map(key => `${key}=${telegramQuery[key]}`)
        .join('\n');

        const hash = crypto.createHmac('sha256', secretKey).update(dataCheck).digest('hex');

        if (hash !== telegramQuery.hash) {
            throw new CustomError(401, 'Unauthorized');
        }

        return true;

    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const createUser = async (data: CreateUser): Promise<UserResponse> => {
    try {
        data.createdAt = Timestamp.now();
        data.updatedAt = Timestamp.now();
        const docRef = await userCollection.add(data);
        const newUser = { id: docRef.id, ...data };
        return newUser;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const accessToken = async (): Promise<string> => {
    try {
        console.log('process.env.JWT_SECRET============================',process.env.SECRET_KEY);
        const token = jwt.sign( {}, process.env.SECRET_KEY || '', { algorithm: 'HS256', expiresIn: '12h' });
        console.log('token============================',token);
        return token;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const refreshToken = async (): Promise<string> => {
    try {
        const token = jwt.sign({}, process.env.SECRET_KEY || '', { algorithm: 'HS256', expiresIn: '24h' });
        return token;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const verifyAccessToken = async (token: string): Promise<any> => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY || '') as JwtPayload;
        if(!decoded){
            throw new CustomError(401, 'Unauthorized');
        }
        return decoded;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const verifyRefreshToken = async (token: string): Promise<any> => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY || '') as JwtPayload;
        if(!decoded){
            throw new CustomError(401, 'Unauthorized');
        }
        return decoded;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getUserById = async (id: string): Promise<UserResponse | null> => {
    try {
        const doc = await userCollection.doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } as UserResponse : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getUserByTelegramUid = async (data: FindUserByTelegramUid): Promise<UserResponse | null> => {
    try {
        const querySnapshot = await userCollection
            .where('telegramUid', '==', data.telegramUid)
            .limit(1)
            .get();

        if (querySnapshot.empty) {
            return null;
        }

        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as UserResponse;
    } catch (error) {
        console.error('Error in getUserByTelegramUid:', error);
        throw error;
    }
};


export const updateUser = async (id: string, data: UpdateUserRequest): Promise<void> => {
    try {
        data.updatedAt = Timestamp.now();
        await userCollection.doc(id).update(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const countUser = async (): Promise<number> => {
    try {
        const querySnapshot = await userCollection.count().get();
        return querySnapshot.data().count;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteUser = async (id: string): Promise<void> => {
    try {
        await userCollection.doc(id).delete();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
