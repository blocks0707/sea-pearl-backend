import { db } from '../config/db'; // Firestore DB import
import { SendMessage, CreateInviteResponse, InviteResponse } from '../interfaces/inviteInterface';
import { Timestamp } from 'firebase-admin/firestore';






const inviteCollection = db.collection('invites');



export const createInvite = async (data: SendMessage): Promise<CreateInviteResponse> => {
    try {
        data.createdAt = Timestamp.now();
        const docRef = await inviteCollection.add(data);
        const newInvite = { id: docRef.id, userId: data.userId, guestId: data.guestId, accepted: data.accepted, createdAt: data.createdAt };
        return newInvite;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getInviteByGuestUid = async (guestUid: string): Promise<InviteResponse | null> => {
    try {
        const doc = await inviteCollection.where('guestUid', '==', guestUid).get();
        if (doc.empty) {
            return null;
        }
        const invite = { id: doc.docs[0].id, ...doc.docs[0].data() } as InviteResponse;
        return invite;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getAllInvites = async (userId: string): Promise<InviteResponse[]> => {
    try {
        const querySnapshot = await inviteCollection.where('userId', '==', userId).get();
        const invites: InviteResponse[] = [];
        querySnapshot.forEach((doc) => {
            const invite = { id: doc.id, ...doc.data() } as InviteResponse;
            invites.push(invite);
        });
        return invites;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const deleteInvite = async (id: string): Promise<void> => {
    try {
        await inviteCollection.doc(id).delete();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
