import { Timestamp } from "firebase-admin/firestore";

export interface Invite {
    id: string;
    userId: string;
    guestId: string;
    accepted: boolean;
    createdAt: Timestamp;
}


export type SendMessage = Pick<Invite, 'userId'> & Partial<Omit<Invite, 'userId'>>;

export type CommitResponse = Invite;

export type CreateInviteResponse = Pick<Invite, 'id'> & Partial<Omit<Invite, 'id'>>;

export type InviteResponse = Invite;

export type InviteResponses = InviteResponse[];

export type FindInviteByUserId = Pick<Invite, 'userId'>;

export type FindInviteByGuestId = Pick<Invite, 'guestId'>;