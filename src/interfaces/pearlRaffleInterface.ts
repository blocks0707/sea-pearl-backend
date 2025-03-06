import { Timestamp } from "firebase-admin/firestore";

export interface PearlRaffle {
    id: string;
    round_number: number;
    period: {start: Timestamp, end: Timestamp};
    participants: number;  //인원수
    min_participants: number;  //추첨 최소 인원수
    winners: {name: string, lotto_number: string, grade: number}[]; //로또 번호는 pearlRaffleLog의 아이디
    entry_fee: number;  //구매 비용
    entry_type: string;  //구매 자원
    reward: {amount: number, reward_type: string, grade: number, winners: number}[]; //상금, 등수, 인원 수 설정
    indestructible: boolean; //시작하면 바꿀 수 없음에 사용
    done: boolean; // 종료여부
    createdAt: Timestamp;
}


export type AddPearlRaffle = Omit<PearlRaffle, 'id'>;

export type CreatePearlRaffle = Pick<PearlRaffle, 'entry_fee' | 'entry_type' | 'reward' | 'period' | 'min_participants'> & Partial<Pick<PearlRaffle, 'round_number' | 'participants' | 'winners' | 'indestructible' | 'done' | 'createdAt'>>;

export type PearlRaffleResponse = Pick<PearlRaffle, 'id'> & Partial<Omit<PearlRaffle, 'id'>>;

export type CommonPearlRaffleResponse = PearlRaffle;

export type FindPearlRaffleById = Pick<PearlRaffle, 'id'>;

export type UpdatePearlRaffle = Pick<PearlRaffle, 'id'> & Partial<Omit<PearlRaffle, 'id'>>;
