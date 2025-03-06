
import {z} from "zod";

export const GetAllProjectsSchema = z.object({
    userId: z.string(),
})


export const GetCategorizedQuestsSchema = z.object({
    userId: z.string(),
    projectId: z.string(),
})


export const AchieveQuestSchema = z.object({
    userId: z.string(),
    questId: z.string(),
})