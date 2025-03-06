import { findQuestsByProjectId, getQuestById, updateQuest } from '../models/questModel';
import {  findQuestLogsByUserIdAndQuestAndCreatedAt, findQuestLogsByUserIdAndQuestAndCreatedAtLastOne, findNoneQuestLogsByUserIdAndQuest, findNoneQuestLogsByUserIdAndQuestLastOne } from '../models/questLogModel';
import { getAllProject } from '../models/projectModel';
import { createQuestLog, countCompletedQuestLogsByQuest, updateQuestLog } from '../models/questLogModel';
import { createTransaction } from '../models/transactionModel';
import { getAssetByUserId, updateAsset } from '../models/assetModel';
import { Timestamp } from 'firebase-admin/firestore';
import { CustomError } from '../config/errHandler';

interface QuestInfo {
    id: string;
    questNumber?: number;
    questLogo?: string;
    title?: string;
    reward?: { type: string, amount: number }[];
    url?: string;
    achievedRound?: number;
    remainingRound?: number;
    resetCycle?: string;
    completed?: boolean;
    enabledToClaim?: boolean;
}

interface CategorizedQuests {
    daily: QuestInfo[];
    weekly: QuestInfo[];
    monthly: QuestInfo[];
    none: QuestInfo[];
}

// Helper functions to check if a date is today, this week, or this month in UTC

// const isToday = async (date: Date): Promise<boolean> => {
//     const now = new Date();
//     return date.getUTCFullYear() === now.getUTCFullYear() &&
//            date.getUTCMonth() === now.getUTCMonth() &&
//            date.getUTCDate() === now.getUTCDate();
// };

// const getUTCWeek = async (d: Date): Promise<number> => {
//     //오늘이 몇 년, 몇 월, 며칠인지. 시간은 자정.
//     const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
//     date.setUTCHours(0, 0, 0, 0);
//     // Adjust date to nearest Thursday: current date + 4 - current day number (with Sunday as 7)
//     // 목요일 기준이다.
//     date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
//     //올해 초.
//     const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
//     //오늘에서 연초를 빼서 몇 번째 주인지 확인한다.
//     return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
// };

// const isThisWeek = async (date: Date): Promise<boolean> => {
//     const now = new Date();
//     return date.getUTCFullYear() === now.getUTCFullYear() && getUTCWeek(date) === getUTCWeek(now);
// };

// const isThisMonth = async (date: Date): Promise<boolean> => {
//     const now = new Date();
//     return date.getUTCFullYear() === now.getUTCFullYear() &&
//            date.getUTCMonth() === now.getUTCMonth();
// };

const inPeriod = (start: Timestamp, end: Timestamp): boolean => {
    const now = new Date();
    return now >= start.toDate() && now <= end.toDate();
}



export const getPeriodRange = async (resetCycle: 'daily' | 'weekly' | 'monthly' | 'none'): Promise<any> => {
    const now = new Date();
    let start:Date | null = new Date(now);
    let end:Date | null = new Date(now);
    
    switch (resetCycle) {
      case 'daily':
        // 오늘 0시로 설정
        start.setHours(0, 0, 0, 0);
        // 내일 0시
        end = new Date(start);
        end.setDate(end.getDate() + 1);
        break;
      case 'weekly':
        // 이번 주 월요일 0시를 구함 (자정 기준)
        // getDay(): 0(일) ~ 6(토). 월요일은 1
        const day = start.getDay();
        start.setDate(start.getDate() - day);
        start.setHours(0, 0, 0, 0);
        // 다음주 월요일 0시
        end = new Date(start);
        end.setDate(end.getDate() + 7);
        break;
      case 'monthly':
        // 이번 달 1일 0시
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        // 다음 달 1일 0시
        end = new Date(start);
        end.setMonth(end.getMonth() + 1);
        break;
      case 'none':
        start = null;
        end = null;
        break;

    }
    return { start, end };
  }


export const getAllProjectsService = async (userId: string): Promise<any[] | []> => {
    try {
        //전체 프로젝트 가져와.
        const allProjects = await getAllProject();
        if(allProjects.length === 0){
            return [];
        }
        let results:any[] = [];
        //allProjects에 있는 project 번호로 퀘스트들 조회. 
        //퀘스트들에 있는 reward들을 가져와서 타입별로 구분하고 각각 모두 더한다. 
        //객체에 프로젝트 이름, 프로젝트 이름, 프로젝트 로고 url, reward 타입별 모두 더한 값 객체에 넣어서 빈배열에 넣고 작업이 끝나면 반환한다.
        await Promise.all(allProjects.map(async (project) => {
            if(project.enabled === false) return;
            const questObj = await getCategorizedQuests(userId, project.id);
            if(questObj.daily.length === 0 && questObj.weekly.length === 0 && questObj.monthly.length === 0 && questObj.none.length === 0) {
                results.push({
                    projectId: project.id,
                    projectName: project.name,
                    projectNumber: project.projectNumber,
                    projectLogo: project.logo,
                })
            }

            const questsKey = Object.keys(questObj) as Array<keyof CategorizedQuests>;
            //만약 프로젝트에서 daily, weekly, monthly, none 퀘스트가 없으면 그냥 pass한다. 
            if(questObj['daily'].length === 0 && questObj['weekly'].length === 0 && questObj['monthly'].length === 0 && questObj['none'].length === 0) return;
            const allRewards:Record<string, number> = {};
            await Promise.all(questsKey.map(async (key) => {
                await Promise.all(questObj[key].map(async(quest:any) => {
                    if(quest.enabled === false) return;
                    const originalQuest = await getQuestById({id:quest.id});
                    await originalQuest.reward?.map((item:any) => {
                        allRewards[item.type] = (allRewards[item.type] || 0) + item.amount;
                    });
                }));
            }));
            results.push({
                projectId: project.id,
                projectName: project.name,
                projectNumber: project.projectNumber,
                projectLogo: project.logo,
                rewards: allRewards
            });
        }));
        return results.sort((a, b) => a.projectNumber - b.projectNumber);
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const getCategorizedQuests = async (userId: string, projectId: string): Promise<CategorizedQuests> => {
    try {
        //유저의 특정 퀘스트 로그 모두 가져오기
        const quests = await findQuestsByProjectId(projectId);

        if(quests.length === 0){
            return {
                daily: [],
                weekly: [],
                monthly: [],
                none: []
            };
        }

        // const now = new Date();
        const categorizedQuests: CategorizedQuests = {
            daily: [],
            weekly: [],
            monthly: [],
            none: []
        };
       
        await Promise.all(quests.map(async (quest) => {
            //정해진 기간이 있을 경우에 현재 시점이 그 기간을 벗어나면 pass
            let completed = false;
            if(quest.enabled === false) return;
            //기간 있는지 확인
            if(quest.period){
                //기간 벗어나면 끝
                if(!inPeriod(quest.period.start, quest.period.end)) {
                    completed = true;
                    await updateQuest({id: quest.id, enabled: false});
                    // const resetCycle = quest.resetCycle;
                    // const questInfo: QuestInfo = {
                    //     id: quest.id,
                    //     questNumber: quest.questNumber,
                    //     title: quest.title,
                    //     reward: quest.reward,
                    //     url: quest.url,
                    //     remainingRound: 0,
                    //     achievedRound: 0,
                    //     resetCycle: quest.resetCycle,
                    //     completed: completed,
                    //     enabledToClaim:false
                    // };
                    // if(resetCycle === 'daily'){
                    //     categorizedQuests.daily.push(questInfo);
                    // } else if(resetCycle === 'weekly'){
                    //     categorizedQuests.weekly.push(questInfo);
                    // } else if(resetCycle === 'monthly'){
                    //     categorizedQuests.monthly.push(questInfo);
                    // }
                    return;
                } else{
                    //기간은 안 벗어났는데 maxParticipants 도달하면 끝
                    if(quest.maxParticipants){
                        const completedCount = await countCompletedQuestLogsByQuest(quest.id);  
                        if(completedCount >= quest.maxParticipants) {
                            // quest.enabled = false;
                            // completed = true;
                            await updateQuest({id: quest.id, enabled: false});
                            return;
                        }
                        // const resetCycle = quest.resetCycle;
                        // const questInfo: QuestInfo = {
                        //     id: quest.id,
                        //     questNumber: quest.questNumber,
                        //     title: quest.title,
                        //     reward: quest.reward,
                        //     url: quest.url,
                        //     remainingRound: 0,
                        //     achievedRound: 0,
                        //     resetCycle: quest.resetCycle,
                        //     completed: completed,
                        //     enabledToClaim:false
                        // };
                        // if(resetCycle === 'daily'){
                        //     categorizedQuests.daily.push(questInfo);
                        // } else if(resetCycle === 'weekly'){
                        //     categorizedQuests.weekly.push(questInfo);
                        // } else if(resetCycle === 'monthly'){
                        //     categorizedQuests.monthly.push(questInfo);
                        // }
                        
                    }
                }
            }

            //정해진 기간 없이 maxParticipants가 있는 경우 현재 완료된 로그의 수가 maxParticipants보다 크거나 같을 때에는 pass
            if(!quest.period && quest.maxParticipants){
                //퀘스트 로그들 중에서 완료(quest.completed)의 수가 quest.maxParticipants에 도달했을 때 return
                const completedCount = await countCompletedQuestLogsByQuest(quest.id);
                if(completedCount >= quest.maxParticipants) {
                    await updateQuest({id: quest.id, enabled: false});
                    // quest.enabled = false;
                    // completed = true;
                    // const resetCycle = quest.resetCycle;
                    // const questInfo: QuestInfo = {
                    //     id: quest.id,
                    //     questNumber: quest.questNumber,
                    //     title: quest.title,
                    //     reward: quest.reward,
                    //     url: quest.url,
                    //     remainingRound: 0,
                    //     achievedRound: 0,
                    //     resetCycle: quest.resetCycle,
                    //     completed: completed,
                    //     enabledToClaim:false
                    // };
                    // if(resetCycle === 'daily'){
                    //     categorizedQuests.daily.push(questInfo);
                    // } else if(resetCycle === 'weekly'){
                    //     categorizedQuests.weekly.push(questInfo);
                    // } else if(resetCycle === 'monthly'){
                    //     categorizedQuests.monthly.push(questInfo);
                    // }
                    return;
                }
            }
            if(!quest.resetCycle) throw new CustomError(400, 'Quest resetCycle not found');
            if(!['daily', 'weekly', 'monthly', 'none'].includes(quest.resetCycle)) throw new CustomError(400, 'Invalid resetCycle');
            if(!quest.roundInCycle) throw new CustomError(400, 'Quest roundInCycle not found');
            //
            const { start, end } = await getPeriodRange(quest.resetCycle as 'daily' | 'weekly' | 'monthly' | 'none'); 
  
            //유저 아이디와 quest 아이디를 사용해서 resetCycle에 맞는 유저의 questlog를 모두 가져온다.
            const allLogs = await findQuestLogsByUserIdAndQuestAndCreatedAt(userId, quest.id, start, end);
    
            if (allLogs.length > 0) {
                switch (quest.resetCycle) {
                    //특정 기간 동안(daily, weekly, monthly)의 로그들의 갯수가 quest.roundInCycle보다 작을 때는 quest를 수행 가능하게 하고, 같거나 크면 enabled를 false로 변경
                    case 'daily':
                        allLogs.length < quest.roundInCycle ? completed = false :  completed = true;
                        break;
                    case 'weekly':
                        // If log is from this week, it's not enabled
                        allLogs.length < quest.roundInCycle ? completed = false : completed = true;
                        break;
                    case 'monthly':
                        // If log is from this month, it's not enabled
                        allLogs.length < quest.roundInCycle ? completed = false : completed = true;
                        break;
                    case 'none':
                        // Any log exists means not enabled
                        const nonelogs = await findNoneQuestLogsByUserIdAndQuest(userId, quest.id);
                        nonelogs.length < quest.roundInCycle ? completed = false : completed = true;
                        break;
                    default:
                        throw new CustomError(400, 'Invalid resetCycle');
                }
            } 

            let remainingRound = 0;
            let achievedRound =0;
            if(quest.title === "Open 10 FreeBoxes"){
                remainingRound = 10 - allLogs.length;
                achievedRound = allLogs.length;            
            } else if(quest.title === "Open 20 FreeBoxes"){
                const alltenLogs = await findQuestLogsByUserIdAndQuestAndCreatedAt(userId, "8jrgWLhDx7opP8gWUuzH", start, end);
                remainingRound = 20 - allLogs.length - alltenLogs.length ;
                achievedRound = allLogs.length + alltenLogs.length;            
            } else if(quest.title === "Open 30 FreeBoxes"){
                const alltenLogs = await findQuestLogsByUserIdAndQuestAndCreatedAt(userId, "8jrgWLhDx7opP8gWUuzH", start, end);
                const alltwentyLogs = await findQuestLogsByUserIdAndQuestAndCreatedAt(userId, "5PXuEQvW2YBmvDry1icB", start, end);
                remainingRound = 30 - allLogs.length - alltenLogs.length  - alltwentyLogs.length;
                achievedRound = allLogs.length + alltenLogs.length + alltwentyLogs.length;            
            } else {
                remainingRound = quest.roundInCycle - allLogs.length;
                achievedRound = allLogs.length;
            }

            let lastLog:any;
            if(quest.resetCycle !== 'none') {
                 lastLog = await findQuestLogsByUserIdAndQuestAndCreatedAtLastOne(userId, quest.id, start, end);
            } else {
                lastLog = await findNoneQuestLogsByUserIdAndQuestLastOne(userId, quest.id);
            }

            if(lastLog === null) {
                completed = false;
            } else {
                completed = true
            }

            let requestReward = false;
            if(quest.enabled === true && lastLog !== null  && lastLog.completed === false){
                requestReward = true
            } else {
                requestReward = false
            }
            const questInfo: QuestInfo = {
                id: quest.id,
                questNumber: quest.questNumber,
                questLogo: quest.questLogo,
                title: quest.title,
                reward: quest.reward,
                url: quest.url,
                remainingRound: remainingRound,
                achievedRound: achievedRound,
                resetCycle: quest.resetCycle,
                completed: completed,
                enabledToClaim: requestReward
            };

            // Ensure quest.resetCycle is valid before using it as an index
            if (quest.resetCycle && ['daily', 'weekly', 'monthly', 'none'].includes(quest.resetCycle)) {
                categorizedQuests[quest.resetCycle as keyof CategorizedQuests].push(questInfo);
            } else {
                console.warn(`Invalid resetCycle for quest ${quest.id}`);
                categorizedQuests.none.push(questInfo);
            }
        }));

        // 각 카테고리별로 questNumber 기준으로 정렬
        categorizedQuests.daily.sort((a, b) => (a.questNumber || 0) - (b.questNumber || 0));
        categorizedQuests.weekly.sort((a, b) => (a.questNumber || 0) - (b.questNumber || 0));
        categorizedQuests.monthly.sort((a, b) => (a.questNumber || 0) - (b.questNumber || 0));
        categorizedQuests.none.sort((a, b) => (a.questNumber || 0) - (b.questNumber || 0));


        return categorizedQuests;
    } catch (error) {
        console.error('Error getting categorized quests:', error);
        throw new CustomError(500, 'Failed to categorize quests');
    }
};



// export const achieveQuest = async (userId: string, questId: string) => {
//     try {
//         //유저 자산 가져옴.
//         const asset = await getAssetByUserId({userId});
//         if (!asset) {
//             throw new CustomError(404, 'Asset not found');
//         }

//         //퀘스트 아이디로 퀘스트 가져옴.
//         const quest = await getQuestById({id: questId});
//         if (!quest) {
//             throw new CustomError(404, 'Quest not found');
//         }

//         //퀘스트 시작, 종료 기간 가져옴
//         const {start, end} = await getPeriodRange(quest.resetCycle as 'daily' | 'weekly' | 'monthly' | 'none');

//         //퀘스트 projectId, roundInCycle 가져옴
//         if (!quest.projectId) throw new CustomError(400, 'Quest projectId not found');
//         if (!quest.roundInCycle) throw new CustomError(400, 'Quest roundInCycle not found');

//         //퀘스트에 있는 리워드 가져옴.
//         const reward = quest.reward;
//         if (!reward) {
//             throw new CustomError(400, 'Quest reward not found');
//         }

//         //퀘스트 로그에 있는 특정 유저의 특정 퀘스트 로그들 가져옴.
//         const allLogs = await findQuestLogsByUserIdAndQuestAndCreatedAt(userId, quest.id, start, end);

//         //이미 끝난 퀘스트는 끝났다고 에러 발생시키고 나머지는 로그 기록.
//         if (allLogs.length > quest.roundInCycle-1) {
//             throw new CustomError(400, 'Quest already achieved');
//         } else if (allLogs.length < quest.roundInCycle-1) {
//             await createQuestLog({
//                 userId,
//                 questId,
//                 projectId: quest.projectId!, // Non-null assertion is safe because it's already checked
//                 createdAt: Timestamp.now(),
//                 progressData: {round: allLogs.length+1}
//             });
//         } else {
//             // 퀘스트 리워드를 창고 유저의 자산에 더하기. 트랜잭션도 날리기.
//             await Promise.all(reward.map(async (r) => {
//                 await createTransaction({
//                     from: "company",
//                     to: userId,
//                     reason: quest.title,
//                     amount: r.amount,
//                     fee_type: r.type
//                 });
            
//                 let newAssetData = {};
//                 if (r.type === 'pearl') {
//                     newAssetData = { pearl: asset.pearl + r.amount };
//                 } else if (r.type === 'shell') {
//                     newAssetData = { shell: asset.shell + r.amount };
//                 } else if (r.type === 'usdt') {
//                     newAssetData = { usdt: asset.usdt + r.amount };
//                 }
//                 await updateAsset(userId, newAssetData);
//             }));    
//             await createQuestLog({
//                 userId,
//                 questId,
//                 projectId: quest.projectId!, // Non-null assertion is safe because it's already checked
//                 createdAt: Timestamp.now(),
//                 progressData: {completed: true}
//             });
//         }
//         return 

//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }


export const loginQuest = async (userId: string): Promise<any> => {
    try {
        const loginQuest = "3XPiGlUJqdeIze7A48tr";
        const check = await checkQuestProgress(userId, loginQuest);
        if(check === "archived"){
            return
        }
        return
    } catch (error) {
        console.error(error);
        throw error;
    }
}



export const freeboxQuest = async (userId: string): Promise<any> => {
    try {
        const firstQuest = "8jrgWLhDx7opP8gWUuzH";
        const secondQuest = "5PXuEQvW2YBmvDry1icB";
        const thirdQuest = "n4lG35dIk7XYEGBvdABd";

        const firstJob = await checkQuestProgress(userId, firstQuest);
        if(firstJob === "archived"){
            const secondJob = await checkQuestProgress(userId, secondQuest);
            if(secondJob === "archived"){
                const thirdJob = await checkQuestProgress(userId, thirdQuest);
                if(thirdJob === "archived"){
                    return 
                }
                return 
            }
            return 
        }
        return
        
        //각각의 퀘스트에 대한 유저의 퀘스트 로그가 몇 개인지 확인한다. 첫번째 퀘스트가 완료되면 자동으로 2번째 퀘스트로 넘어가고, 2번째가 완료되면 자동으로 3번째 퀘스트로 넘어간다.     
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const tapChangeQuest = async (userId: string): Promise<any> => {
    try {
        const tapQuest = "d66WvzrEd0Z79jnixDxN";
        const check = await checkQuestProgress(userId, tapQuest);
        if(check === "archived"){
            return
        }
        return
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const pearlRaffleQuest = async (userId: string): Promise<any> => {
    try {
        const pearlRaffleQuest = "KRhzE4o2dzslMNdFcCEb";
        const check = await checkQuestProgress(userId, pearlRaffleQuest);
        if(check === "archived"){
            return
        }
        return
    } catch (error) {
        console.error(error);
        throw error;
    }
}   



export const shellRaffleQuest = async (userId: string): Promise<any> => {
    try {
        const shellRaffleQuest = "A9AVrV7PeDT1tIQwFeLz";
        const check = await checkQuestProgress(userId, shellRaffleQuest);
        if(check === "archived"){
            return
        }
        return
    } catch (error) {
        console.error(error);
        throw error;
    }
}



export const checkQuestProgress = async (userId: string, questId: string): Promise<any> => {
    try {
        //퀘스트 아이디로 퀘스트 가져옴.
        const quest = await getQuestById({id: questId});
        if (!quest) {
            throw new CustomError(404, 'Quest not found');
        }

        //퀘스트 시작, 종료 기간 가져옴
        const {start, end} = await getPeriodRange(quest.resetCycle as 'daily' | 'weekly' | 'monthly' | 'none');

        //퀘스트 로그들 가져옴
        const questLogs = await findQuestLogsByUserIdAndQuestAndCreatedAt(userId, questId, start, end);
        if(!quest.roundInCycle) throw new CustomError(400, 'Quest not found');
        
        //퀘스트 로그와 roundInCycle 비교함. 퀘스트 종료 되었는지 확인
        if(questLogs.length > quest.roundInCycle-1){
            let lastLog:any;
            if(quest.resetCycle !== 'none') {
                 lastLog = await findQuestLogsByUserIdAndQuestAndCreatedAtLastOne(userId, quest.id, start, end);
            } else {
                lastLog = await findNoneQuestLogsByUserIdAndQuestLastOne(userId, quest.id);
            }
            if(lastLog){
                if(lastLog.completed === true){ 
                    const result:QuestInfo = {
                        id: quest.id,
                        questNumber: quest.questNumber,
                        title: quest.title,
                        reward: quest.reward,
                        url: quest.url,
                        remainingRound: 0,
                        achievedRound: quest.roundInCycle,
                        resetCycle: quest.resetCycle,
                        completed: true,
                        enabledToClaim: false
                    }
                    return result;
                } else {
                    const result:QuestInfo = {
                        id: quest.id,
                        questNumber: quest.questNumber,
                        title: quest.title,
                        reward: quest.reward,
                        url: quest.url,
                        remainingRound: 0,
                        achievedRound: quest.roundInCycle,
                        resetCycle: quest.resetCycle,
                        completed: true,
                        enabledToClaim: true
                    }
                    return result;
                }
            }
            throw new CustomError(400, 'Quest already achieved');
        } else if(questLogs.length < quest.roundInCycle-1){
            await createQuestLog({
                userId,
                questId,
                projectId: quest.projectId!, // Non-null assertion is safe because it's already checked
                createdAt: Timestamp.now(),
                completed: false,
                progressData: {round: questLogs.length+1}
            });    
            const result:QuestInfo = {
                id: quest.id,
                questNumber: quest.questNumber,
                title: quest.title,
                reward: quest.reward,
                url: quest.url,
                remainingRound: quest.roundInCycle - questLogs.length+1,
                achievedRound: questLogs.length+1,
                resetCycle: quest.resetCycle,
                completed: false,
                enabledToClaim: false
            }
            return result
        } else { 
            await createQuestLog({
                userId,
                questId,
                projectId: quest.projectId!, // Non-null assertion is safe because it's already checked
                createdAt: Timestamp.now(),
                completed: false,
                progressData: {completed: true}
            }); 
            const result:QuestInfo = {
                id: quest.id,
                questNumber: quest.questNumber,
                title: quest.title,
                reward: quest.reward,
                url: quest.url,
                remainingRound: 0,
                achievedRound: quest.roundInCycle,
                resetCycle: quest.resetCycle,
                completed: true,
                enabledToClaim: true
            }
            return result
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}



export const completedQuest = async (userId: string, questId: string): Promise<any> => {
    try {
        //유저 자산 가져옴.
        const asset = await getAssetByUserId({userId});
        if (!asset) {
            throw new CustomError(404, 'Asset not found');
        }

        //퀘스트 아이디로 퀘스트 가져옴.
        const quest = await getQuestById({id: questId});
        if (!quest) {
            throw new CustomError(404, 'Quest not found');
        }

        //퀘스트 리워드 가져옴.
        const reward = quest.reward;
        if (!reward) {
            throw new CustomError(400, 'Quest reward not found');
        }

        //퀘스트 시작, 종료 기간 가져옴
        const {start, end} = await getPeriodRange(quest.resetCycle as 'daily' | 'weekly' | 'monthly' | 'none');

        //퀘스트 로그들 가져옴
        // const questLogs = await findQuestLogsByUserIdAndQuestAndCreatedAt(userId, questId, start, end);
        // if(!quest.roundInCycle) throw new CustomError(400, 'Quest not found');
        
        // //퀘스트 로그 확인해서 돈을 받았는지 확인
        // if(questLogs.length < quest.roundInCycle){
        //     throw new CustomError(400, 'Quest not completed');
        // } else { 
            let lastLog:any;
            if(quest.resetCycle !== 'none') {
                 lastLog = await findQuestLogsByUserIdAndQuestAndCreatedAtLastOne(userId, quest.id, start, end);
            } else {
                lastLog = await findNoneQuestLogsByUserIdAndQuestLastOne(userId, quest.id);
            }
            if(!lastLog) throw new CustomError(400, 'Quest log not found');
            if(lastLog.completed === true){
                throw new CustomError(400, 'Quest reward already received');
            } else {
                await Promise.all(reward.map(async (r) => {
                    await createTransaction({
                        from: "company",
                        to: userId,
                        reason: quest.title,
                        amount: r.amount,
                        fee_type: r.type
                    });
                    let newAssetData = {};
                    if (r.type === 'pearl') {
                        newAssetData = { pearl: asset.pearl + r.amount };
                    } else if (r.type === 'shell') {
                        newAssetData = { shell: asset.shell + r.amount };
                    } else if (r.type === 'usdt') {
                        newAssetData = { usdt: asset.usdt + r.amount };
                    }
                    await updateAsset(userId, newAssetData);
                }));    
                await updateQuestLog({id: lastLog.id, completed: true})
                return
            }

    } catch (error) {
        console.error(error);
        throw error;
    }
}
