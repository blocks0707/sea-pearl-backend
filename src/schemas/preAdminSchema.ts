import {z} from "zod";


//export const UpdateRaffleBase = z.object({
//     shell_raffle_reward: z.array(z.object({
//         amount: z.number(),
//         reward_type: z.string(),
//         grade: z.number(),
//         winners: z.number(),
//     })).optional(),
//     shell_raffle_entry: z.object({
//         entry_type: z.string(),
//         fee: z.number(),
//     }).optional(),
//     pearl_raffle_reward: z.array(z.object({
//         amount: z.number(),
//         reward_type: z.string(),
//         grade: z.number(),
//         winners: z.number(),
//     })).optional(),
//     pearl_raffle_entry: z.object({
//         entry_type: z.string(),
//         fee: z.number(),
//     }).optional(),
// })


export const CreatePearlRaffleSchema = z.object({
    entry_type: z.string(),
    entry_fee: z.number(),
    reward: z.array(z.object({
        amount: z.number(),
        reward_type: z.string(),
        grade: z.number(),
        winners: z.number(),
    })),
    period: z.object({
        start: z.string(),
        end: z.string(),
    }),
    min_participants: z.number(),
})


export const UpdateShellRaffleSchema = z.object({
    id: z.string(),
    period: z.object({
        start: z.string(),
        end: z.string(),
    }).optional(),
    participants: z.number().   optional(),  //인원수
    min_participants: z.number().optional(),  //추첨 최소 인원수
    winners: z.array(z.object({
        name: z.string(),
        lotto_number: z.string(),
        grade: z.number(),
    })).optional(), //로또 번호는 pearlRaffleLog의 아이디
    entry_fee: z.number().optional(),  //구매 비용
    entry_type: z.string().optional(),  //구매 자원
    reward: z.array(z.object({
        amount: z.number(),
        reward_type: z.string(),
        grade: z.number(),
        winners: z.number(),
    })).optional(),
    indestructible: z.boolean().optional(), //시작하면 바꿀 수 없음에 사용
    done: z.boolean().optional() // 종료여부
})


export const CreateShellRaffleSchema = z.object({
    entry_type: z.string(),
    entry_fee: z.number(),
    period: z.object({
        start: z.string(),
        end: z.string(),
    }),
    reward: z.array(z.object({
        amount: z.number(),
        reward_type: z.string(),
        grade: z.number(),
        winners: z.number(),
    })),
    min_participants: z.number(),
})


export const UpdatePearlRaffleSchema = z.object({
    id: z.string(),
    period: z.object({
        start: z.string(),
        end: z.string(),
    }).optional(),
    participants: z.number().optional(),  //인원수
    min_participants: z.number().optional(),  //추첨 최소 인원수
    winners: z.array(z.object({
        name: z.string(),
        lotto_number: z.string(),
        grade: z.number(),
    })).optional(), //로또 번호는 pearlRaffleLog의 아이디
    entry_fee: z.number().optional(),  //구매 비용
    entry_type: z.string().optional(),  //구매 자원
    reward: z.array(z.object({
        amount: z.number(),
        reward_type: z.string(),
        grade: z.number(),
        winners: z.number(),
    })).optional(),
    indestructible: z.boolean().optional(), //시작하면 바꿀 수 없음에 사용
    done: z.boolean().optional() // 종료여부  
})


export const UpdateRoulette = z.object({
    entry: z.array(z.object({
        entry_type: z.string(),
        fee: z.number(),
        round: z.number(),
    })).optional(),
    reward: z.array(z.object({
        amount: z.number(),
        reward_type: z.string(),
        chance: z.number(),
    })).optional()
})


export const CreateRoulette = z.object({
    entry: z.array(z.object({
        entry_type: z.string(),
        fee: z.number(),
        round: z.number(),
    })),
    reward: z.array(z.object({
        amount: z.number(),
        reward_type: z.string(),
        chance: z.number(),
    }))
})



export const CreateProjectSchema = z.object({
    name: z.string(),
    projectNumber: z.number().optional(),
    logo: z.string().optional(),
    max_participants: z.number().optional(),
    questStartDate: z.string().optional(),
    questEndDate: z.string().optional()
})

export const UpdateProjectSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    logo: z.string().optional(),
    questStartDate: z.date().optional(),
    questEndDate: z.date().optional()
})


export const CreateQuestSchema = z.object({
    projectId: z.string(),
    title: z.string(),
    purpose: z.string().optional(),
    reward: z.array(z.object({
        type: z.string(),
        amount: z.number(),
    })),
    url: z.string().optional(),
    period: z.object({
        start: z.string(),
        end: z.string(),
    }).optional(),
    resetCycle: z.string().optional(),
    resetCount: z.number().optional(),
    roundInCycle: z.number().optional(),
    maxParticipants: z.number().optional(),
    enabled: z.boolean().optional(),
})


export const UpdateQuestSchema = z.object({
    id: z.string(),
    projectId: z.string(),
    questNumber: z.number().optional(),
    title: z.string().optional(),
    purpose: z.string().optional(),
    reward: z.array(z.object({
        type: z.string(),
        amount: z.number(),
    })).optional(),
    url: z.string().optional(),
    period: z.object({
        start: z.string(),
        end: z.string(),
    }).optional(),
    resetCycle: z.string().optional(),
    resetCount: z.number().optional(),
    roundInCycle: z.number().optional(),
    maxParticipants: z.number().optional(),
    enabled: z.boolean().optional(),
})