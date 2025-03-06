import { Timestamp } from "firebase-admin/firestore";
import { ParsedQs } from 'qs';


export interface User {
    id: string;
    userNumber: number;
    telegramUid: number;
    firstName: string;
    lastName: string;
    photo_url: string;
    username: string;
    friends: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}


export type CreateUser = Pick<User, "telegramUid"> & Partial<Omit<User, "telegramUid">>;

export type UserResponse = Pick<User, "id"> & Partial<Omit<User, "id">>;

export type UpdateUserRequest = Partial<User>; 

export type FindUserById = Pick<User, "id">;

export type FindUserByTelegramUid = Pick<User, "telegramUid">;

export type FindUserByTelegramId = Pick<User, "telegramUid">;

export type FindUserByTelegramUsername = Pick<User, "firstName">;

export type DeleteUserRequest = Pick<User, "id">;



export type TelegramQuery = {
    [key: string]: string | string[] | ParsedQs | ParsedQs[] | undefined;
  };