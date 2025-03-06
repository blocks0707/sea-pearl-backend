import { db } from '../config/db'; // Firestore DB import
import { CreateTicket, TicketResponse, FindAllTickets, FindTicketById, FindAllTicketsResponse, DeleteTicketById } from '../interfaces/ticketInterface';
import { Timestamp } from 'firebase-admin/firestore';

const ticketCollection = db.collection('tickets');

export const createTicket = async (data: CreateTicket): Promise<TicketResponse> => {
    try {
        data.createdAt = Timestamp.now();
        const docRef = await ticketCollection.add(data);
        const newTicket = { id: docRef.id, ...data };
        return newTicket;
    } catch (error) {
        throw error;
    }
};

export const getTicketById = async (data: FindTicketById): Promise<TicketResponse | null> => {
    try {
        const doc = await ticketCollection.doc(data.id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } as TicketResponse : null;
    } catch (error) {
        throw error;
    }
};

export const getAllTickets = async (data: FindAllTickets): Promise<FindAllTicketsResponse> => {
    try {
        const snapshot = await ticketCollection.where('userId', '==', data.userId).get();
        const tickets: TicketResponse[] = [];
        snapshot.forEach((doc) => {
            const ticket = doc.data() as TicketResponse;
            tickets.push(ticket);
        });
        return tickets;
    } catch (error) {
        throw error;
    }
};

export const deleteTicket = async (data: DeleteTicketById): Promise<void> => {
    try {
        await ticketCollection.doc(data.id).delete();
    } catch (error) {
        throw error;
    }
};
