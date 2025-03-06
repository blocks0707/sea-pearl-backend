//import {createRaffleBaseService, updateRaffleBaseService, firstCreateRaffles} from '../services/preAdmin';
import {createRouletteService, updateRouletteService, createPearlRaffleService, updatePearlRaffleService, createShellRaffleService, updateShellRaffleService} from '../services/preAdmin';
import {Request, Response} from 'express';
//import {UpdateRaffleBase} from '../schemas/preAdminSchema';
import { UpdateRoulette} from '../schemas/preAdminSchema';
import {CreatePearlRaffleSchema, UpdatePearlRaffleSchema, CreateShellRaffleSchema, UpdateShellRaffleSchema} from '../schemas/preAdminSchema';
import {createQuestService, updateQuestService, createProjectService, updateProjectService} from '../services/preAdmin';
import {CreateProjectSchema, UpdateProjectSchema, CreateQuestSchema, UpdateQuestSchema} from '../schemas/preAdminSchema';
import {CreateFreeboxSchema, UpdateFreeboxSchema} from '../schemas/freeboxSchema';
import {createFreeboxService, updateFreeboxService} from '../services/preAdmin';
import {CreatePearlRaffle} from '../interfaces/pearlRaffleInterface';
import {CreateShellRaffle} from '../interfaces/shellRaffleInterface';
import { CustomError } from '../config/errHandler';
import { Timestamp } from 'firebase-admin/firestore';

export const createPearlRaffleController = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body;
        const parseBody = CreatePearlRaffleSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body');
        }
        const inputData: CreatePearlRaffle = {
            entry_fee: parseBody.data.entry_fee,
            entry_type: parseBody.data.entry_type,
            reward: parseBody.data.reward,
            period: {start: Timestamp.fromDate(new Date(parseBody.data.period.start)), end: Timestamp.fromDate(new Date(parseBody.data.period.end))},
            min_participants: parseBody.data.min_participants,
            
        }
        await createPearlRaffleService(inputData);
        res.status(200).json({message: 'Pearl raffle created successfully'});
        return;
    } catch (error) {
        console.error(error);
        res.json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
};


export const updatePearlRaffleController = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body;
        const parseBody = UpdatePearlRaffleSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body');
        }
        if(!parseBody.data.id) throw new CustomError(400, 'Invalid request body');
        const inputData = {
            ...parseBody.data,
            period: parseBody.data.period ? {
                start: Timestamp.fromDate(new Date(parseBody.data.period.start)),
                end: Timestamp.fromDate(new Date(parseBody.data.period.end))
            } : undefined
        };
        await updatePearlRaffleService(inputData);
        res.status(200).json({message: 'Pearl raffle updated successfully'});
        return;
    } catch (error) {
        console.error(error);
        res.json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
};



export const createShellRaffleController = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body;
        const parseBody = CreateShellRaffleSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body');
        }
        const inputData: CreateShellRaffle = {
            entry_fee: parseBody.data.entry_fee,
            entry_type: parseBody.data.entry_type,
            reward: parseBody.data.reward,
            period: {start: Timestamp.fromDate(new Date(parseBody.data.period.start)), end: Timestamp.fromDate(new Date(parseBody.data.period.end))},
            min_participants: parseBody.data.min_participants,
        }
        await createShellRaffleService(inputData);
        res.status(200).json({message: 'Shell raffle created successfully'});
        return;
    } catch (error) {
        console.error(error);
        res.json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
};


export const updateShellRaffleController = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body;
        const parseBody = UpdateShellRaffleSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body');
        }
        if(!parseBody.data.id) throw new CustomError(400, 'Invalid request body');
        const inputData = {
            ...parseBody.data,
            period: parseBody.data.period ? {
                start: Timestamp.fromDate(new Date(parseBody.data.period.start)),
                end: Timestamp.fromDate(new Date(parseBody.data.period.end))
            } : undefined
        };
        await updateShellRaffleService(inputData);
        res.status(200).json({message: 'Shell raffle updated successfully'});
        return;
    } catch (error) {
        console.error(error);
        res.json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
};



export const createRouletteController = async (req: Request, res: Response): Promise<void> => {
    try {
        await createRouletteService();
        res.status(200).json({message: 'Roulette created successfully'});
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
};



export const updateRouletteController = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body;
        const parseBody = UpdateRoulette.safeParse(body);
        if(!parseBody.success){
            throw new Error('Invalid request body');
        }

        await updateRouletteService(parseBody.data);
        res.status(200).json({message: 'Roulette updated successfully'});
        return;
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
};





export const createQuestController = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body;
        const parseBody = CreateQuestSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body');
        }
        const data = parseBody.data;
        // if (data.period) {
        //     data.period = {
        //         start: Timestamp.fromDate(new Date(data.period.start)),
        //         end: Timestamp.fromDate(new Date(data.period.end))
        //     };
        // }
        await createQuestService(data);
        res.status(200).json({message: 'Quest created successfully'});
        return;
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
};



export const updateQuestController = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body;
        const parseBody = UpdateQuestSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body');
        }
        const data = parseBody.data;
        //if (data.period) {
        //     data.period = {
        //         start: Timestamp.fromDate(new Date(data.period.start)),
        //         end: Timestamp.fromDate(new Date(data.period.end))
        //     };
        // }
        await updateQuestService(data);
        res.status(200).json({message: 'Quest updated successfully'});
        return;
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
};


export const createProjectController = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body;
        const parseBody = CreateProjectSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body');
        }
       
        await createProjectService(parseBody.data);
        res.status(200).json({message: 'Project created successfully'});
        return;
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
};



export const updateProjectController = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body;
        const parseBody = UpdateProjectSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body');
        }
        await updateProjectService(parseBody.data);
        res.status(200).json({message: 'Project updated successfully'});
        return;
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
};



export const createFreeboxController = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body;
        const parseBody = CreateFreeboxSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body');
        }
        await createFreeboxService(parseBody.data);
        res.status(200).json({message: 'Freebox created successfully'});
        return;
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
};


export const updateFreeboxController = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body;
        const parseBody = UpdateFreeboxSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body');
        }
        const {userId, reward} = parseBody.data;
        await updateFreeboxService({id: userId, reward});
        res.status(200).json({message: 'Freebox updated successfully'});
        return;
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
};