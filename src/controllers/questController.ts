import {GetAllProjectsSchema, GetCategorizedQuestsSchema, AchieveQuestSchema} from "../schemas/questSchema";
import {getAllProjectsService, getCategorizedQuests, completedQuest, checkQuestProgress} from "../services/questService";
import {CustomError} from "../config/errHandler";
import {Request, Response} from "express";

export const getAllProjectsController = async (req: Request, res: Response) => {
    try {
        const query = req.query;
        const parseQuery = GetAllProjectsSchema.safeParse(query);
        if(!parseQuery.success){
            throw new CustomError(400, 'Invalid request query', 'ERR_INVALID_REQUEST_QUERY');
        }
        const {userId} = parseQuery.data;
        const projects = await getAllProjectsService(userId);
        res.status(200).json(projects);
        return;
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
}


export const getCategorizedQuestsController = async (req: Request, res: Response) => {
    try {
        const body = req.query;
        const parseBody = GetCategorizedQuestsSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId, projectId} = parseBody.data;
        const categorizedQuests = await getCategorizedQuests(userId, projectId);
        res.status(200).json(categorizedQuests);
        return;
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
}


export const achieveQuestController = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const parseBody = AchieveQuestSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId, questId} = parseBody.data;
        await completedQuest(userId, questId);
        res.status(200).json({ statusCode: 200, customCode: 'OK', message: 'Quest reward earned' });
        return;
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
}



export const visitQuestProgressController = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const parseBody = AchieveQuestSchema.safeParse(body);
        if(!parseBody.success){
            throw new CustomError(400, 'Invalid request body', 'ERR_INVALID_REQUEST_BODY');
        }
        const {userId, questId} = parseBody.data;
        const progress = await checkQuestProgress(userId, questId);
        res.status(200).json(progress);
        return;
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ statusCode: error.statusCode, customCode: error.customCode, message: error.message });
            return;
        }
        res.status(500).json({ statusCode: 500, customCode: 'ERR_INTERNAL_SERVER', message: 'Internal server error' });
        return;
    }
}

