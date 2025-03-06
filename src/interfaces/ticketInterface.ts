import { Timestamp } from "firebase-admin/firestore";

export interface Ticket {
    id: string;
    userId: string;
    adsId: string;
    shell_raffle_id: string;
    shell_raffle_number: number;
    pearl_raffle_id: string;
    pearl_raffle_number: number;
    createdAt: Timestamp;
}


export type CreateTicket = Pick<Ticket, "userId"> & Partial<Omit<Ticket, "userId">>;

export type TicketResponse = Pick<Ticket, "id"> & Partial<Omit<Ticket, "id">>;

export type FindAllTickets = Pick<Ticket, "userId">;

export type FindAllTicketsResponse = TicketResponse[];

export type FindTicketById = Pick<Ticket, "id">;

export type DeleteTicketById = Pick<Ticket, "id">;