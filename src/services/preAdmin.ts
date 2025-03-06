// import {createRaffleBase, updateRaffleBase, getRaffleBase} from "../models/raffleBaseModel";
import {createPearlRaffle, updatePearlRaffle} from "../models/pearlRaffleModel";
import {createShellRaffle, updateShellRaffle} from "../models/shellRaffleModel";
//import {UpdateRaffleBase} from "../interfaces/raffleBaseInterface";
import { CreateFreebox, UpdateFreebox } from "../interfaces";
import {createRoulette, updateRoulette, getRouletteLatest} from "../models/rouletteModel";
import {UpdateRoulette} from "../interfaces/rouletteInterface";
import { createFreebox, updateFreebox} from "../models/freeboxModel";
import {createProject, getAllProjectNumber, updateProject} from "../models/projectModel";
import {createQuest, updateQuest} from "../models/questModel";
//import { UpdateQuest} from "../interfaces/questInterface";
import {CreatePearlRaffle, UpdatePearlRaffle} from "../interfaces/pearlRaffleInterface";
import {CreateShellRaffle, UpdateShellRaffle} from "../interfaces/shellRaffleInterface";
//import {CreateProject,UpdateProject} from "../interfaces/projectInterface";
import {CustomError} from "../config/errHandler";
import {Timestamp} from 'firebase-admin/firestore';


// export const createRaffleBaseService = async (): Promise<void> => {
//     try {
//         await createRaffleBase();
//         return;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

// export const updateRaffleBaseService = async (data: UpdateRaffleBase): Promise<void> => {
//     try {
//         console.log('raffle base data',data)
//         await updateRaffleBase(data);
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };


export const createPearlRaffleService = async (data: CreatePearlRaffle): Promise<void> => {
    try {
        await createPearlRaffle(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const updatePearlRaffleService = async (data: UpdatePearlRaffle): Promise<void> => {
    try {
        await updatePearlRaffle(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};



export const createShellRaffleService = async (data: CreateShellRaffle): Promise<void> => {
    try {
        await createShellRaffle(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const updateShellRaffleService = async (data: UpdateShellRaffle): Promise<void> => {
    try {
        await updateShellRaffle(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};



export const createRouletteService = async (): Promise<void> => {
    try {
        const latestRoulette = await getRouletteLatest();
        if (latestRoulette) {
            throw new CustomError(400, 'Roulette already exists', 'ERR_ROULETTE_EXISTS');
        }
        const created = await createRoulette();
        if (!created) {
            throw new CustomError(500, 'Failed to create roulette', 'ERR_ROULETTE_CREATE_FAILED');
        }
    } catch (error) {
        console.error('Error in createRouletteService:', error);
        if (error instanceof CustomError) {
            throw error;
        }
        throw new CustomError(500, 'Internal server error', 'ERR_INTERNAL_SERVER');
    }
};


export const updateRouletteService = async (data: UpdateRoulette): Promise<void> => {
    try {
        await updateRoulette(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};


// export const firstCreateRaffles = async (): Promise<void> => {
//     try {
//         const base = await getRaffleBase();
//         if (!base) {
//             throw new CustomError(404, 'Raffle base not found', 'ERR_RAFFLE_BASE_NOT_FOUND');
//         }
//         await createPearlRaffle({entry_fee: base.pearl_raffle_entry.fee, entry_type: base.pearl_raffle_entry.entry_type, reward: base.pearl_raffle_reward,});
//         await createShellRaffle({entry_fee: base.shell_raffle_entry.fee, entry_type: base.shell_raffle_entry.entry_type, reward: base.shell_raffle_reward,});
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };



export const createQuestService = async (data: any): Promise<void> => {
    try {
        if(data.period) {
            data.period = {
                start: Timestamp.fromDate(new Date(data.period.start)),
                end: Timestamp.fromDate(new Date(data.period.end))
            };
        }
        await createQuest(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
}



export const updateQuestService = async (data: any): Promise<void> => {
    try {
        if(data.period) {
            data.period = {
                start: Timestamp.fromDate(new Date(data.period.start)),
                end: Timestamp.fromDate(new Date(data.period.end))
            };
        }
        await updateQuest(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const createProjectService = async (data: any): Promise<void> => {
    try {
        const count = await getAllProjectNumber();
        if(data.questStartDate && data.questEndDate) {
            data.questStartDate = Timestamp.fromDate(new Date(data.questStartDate));
            data.questEndDate = Timestamp.fromDate(new Date(data.questEndDate));
        }
        data.enabled = true;
        await createProject({...data, projectNumber: count + 1});
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const updateProjectService = async (data: any): Promise<void> => {
    try {
        if(data.questStartDate && data.questEndDate) {
            data.questStartDate = Timestamp.fromDate(new Date(data.questStartDate));
            data.questEndDate = Timestamp.fromDate(new Date(data.questEndDate));
        }
        await updateProject(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const createFreeboxService = async (data: CreateFreebox): Promise<void> => {
    try {
        await createFreebox(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const updateFreeboxService = async (data: UpdateFreebox): Promise<void> => {
    try {
        await updateFreebox(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

