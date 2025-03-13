//import cron from 'node-cron';
import {CustomError} from '../config/errHandler';
import {getLatestPearlRaffle,  getBuyablePearlRaffle, insideUpdatePearlRaffle} from '../models/pearlRaffleModel';
import {countPearlRaffleLogByRaffleId, getAllPearlRaffleIdArray, findPearlRaffleLogById, deletePearlRaffleLogByLogId} from '../models/pearlRaffleLogModel';
//import {findPearlRaffleLogByRaffleId} from '../models/pearlRaffleLogModel';
import {getLatestShellRaffle, getBuyableShellRaffle, insideUpdateShellRaffle} from '../models/shellRaffleModel';
import {countShellRaffleLogByRaffleId, findShellRaffleLogById, getAllShellRaffleIdArray, deleteShellRaffleLogByLogId} from '../models/shellRaffleLogModel';
import {getUserById} from '../models/userModel';
import {getAssetByUserId} from '../models/assetModel';
import {createTransaction, getTransactionByReasonAndFrom} from '../models/transactionModel';
import {updateAsset} from '../models/assetModel';
import { Timestamp } from 'firebase-admin/firestore';



// export const createPearlRaffleJob = () => {
//     //db에서 최근 발행된 pearlRaffle을 가져옴.
//     //pearlRaffle의 기간이 이번주(이번주 자정 ~ 토요일 23:59:59)인지 확인
//     //만약 있면 커스텀 에러 발생(aleady exist)
//     //없은라면 pearlRaffle 생성
//     //0 0 * * 0
//     cron.schedule('2,12,22,32,42,52 * * * *', async () => {
//         try {
//             const latestPearlRaffle = await getLatestPearlRaffle();
//             console.log('pearl래플 시작',latestPearlRaffle);
//             if(!latestPearlRaffle){
//                 throw new CustomError(400, 'PEARL_RAFFLE_NOT_FOUND');
//             }
//             await insideUpdatePearlRaffle({id: latestPearlRaffle.id, indestructible: true});
//             console.log('new pearl raffle created');
//         } catch (error) {
//             console.error(error);
//             throw new CustomError(400, 'already exist');
//         }
//     }, {
//         scheduled: true, 
//         timezone: "UTC"
//     });
    
// }



export const createPearlRaffleJob = async () => {
    try {
        const latestPearlRaffle = await getLatestPearlRaffle();
        console.log('pearl래플 시작',latestPearlRaffle);
        if(!latestPearlRaffle){
            throw new CustomError(400, 'PEARL_RAFFLE_NOT_FOUND');
        }
        await insideUpdatePearlRaffle({id: latestPearlRaffle.id, indestructible: true});
        console.log('new pearl raffle created');
    } catch (error) {
        console.error(error);
        throw new CustomError(400, 'already exist');
    }
}


// export const createShellRaffleJob = () => {
//     //db에서 최근 발행된 pearlRaffle을 가져옴.
//     //pearlRaffle의 기간이 이번주(이번주 자정 ~ 토요일 23:59:59)인지 확인
//     //만약 있면 커스텀 에러 발생(aleady exist)
//     //없은라면 pearlRaffle 생성
//     //0 0 * * 0
//     cron.schedule('3,13,23,33,43,53 * * * *', async () => {
//         try {
//             const latestShellRaffle = await getLatestShellRaffle();
//             console.log('shell 래플 시작',latestShellRaffle);
//             if(!latestShellRaffle){
//                 throw new CustomError(400, 'Shell_RAFFLE_NOT_FOUND');
//             }
//             await insideUpdateShellRaffle({id: latestShellRaffle.id, indestructible: true});
//             console.log('new shell raffle created');
//         } catch (error) {
//             console.error(error);
//             throw new CustomError(400, 'already exist');
//         }
//     }, {
//         scheduled: true, 
//         timezone: "UTC"
//     });
// }



export const createShellRaffleJob = async () => {
    try {
        const latestShellRaffle = await getLatestShellRaffle();
        console.log('shell 래플 시작',latestShellRaffle);
        if(!latestShellRaffle){
            throw new CustomError(400, 'Shell_RAFFLE_NOT_FOUND');
        }
        await insideUpdateShellRaffle({id: latestShellRaffle.id, indestructible: true});
        console.log('new shell raffle created');
    } catch (error) {
        console.error(error);
        throw new CustomError(400, 'already exist');
    }
}




// export const choosePearlRaffleWinnerJob = () => {
//     //db에서 최근 발행된 pearlRaffle을 가져옴.
//     //db에서 1개 있는 raffleBase을 가져옴.
//     //pearlRaffle의 기간이 저번주(이번주 자정 ~ 토요일 23:59:59)가 맞는지 확인, 그리고 winner배열이 비었는지 확인
//     //만약 pearlRaffle의 기간이 저번주가 아니거나 winner 배열이 1개 이상 있으면  커스텀 에러 발생(aleady exist)
//     //pearlRaffle에서 participants의 수를 가져와서 랜덤으로 raffleBase의 pearl_raffle_winner_number의 수만큼 추첨함
//     //winner 배열에 push
//     cron.schedule('*/10 * * * *', async () => {
//         try {
            
//             //이번 추첨 pearl래플
//             const pickPearlRaffle = await getBuyablePearlRaffle();
//             console.log('추첨 시작', pickPearlRaffle);
//             if(pickPearlRaffle === null){
//                 console.log('no pearl raffle');
//                 throw new CustomError(400, 'PEARL_RAFFLE_NOT_FOUND');
//             }

//             //이번 추첨 pearl 래플에서 참여자가 최소 인원 충족 못하면 에러 발생
//             const participants = await countPearlRaffleLogByRaffleId(pickPearlRaffle.id);
//             if(participants < pickPearlRaffle.min_participants){
//                 await refundPearlRaffleJob();
//                 return;
//             }

//             let pearlRaffleArray = await getAllPearlRaffleIdArray(pickPearlRaffle.id);
//             if(!pearlRaffleArray){
//                 throw new CustomError(400, 'PEARL_RAFFLE_LOG_NOT_FOUND');
//             }
//             if(pearlRaffleArray.length === 0){
//                 throw new CustomError(400, 'PEARL_RAFFLE_LOG_NOT_FOUND');
//             }
//             const numberOfWinners = pickPearlRaffle.reward.reduce((a:number, b:{ amount: number; reward_type: string; grade: number; winners: number; }) => a + b.winners, 0);

//             //fisher-yates shuffle
//             for (let i = pearlRaffleArray.length - 1; i > pearlRaffleArray.length - numberOfWinners -1 ; i--) {
//                 const j = Math.floor(Math.random() * (i + 1));
//                 [pearlRaffleArray[i], pearlRaffleArray[j]] = [pearlRaffleArray[j], pearlRaffleArray[i]];
//             }

//             const winner = await Promise.all(pearlRaffleArray.slice(pearlRaffleArray.length - numberOfWinners).map(async(ticket, i) => {
//                 const log = await findPearlRaffleLogById(ticket.id);
//                 if(!log){
//                     throw new CustomError(400, 'PEARL_RAFFLE_LOG_NOT_FOUND');
//                 }
//                 const user = await getUserById(log.userId);
//                 if(!user){
//                     throw new CustomError(400, 'USER_NOT_FOUND');
//                 }

//                 let cumulative = 0;
//                 let gradeAssigned = 0;
//                 for (const reward of pickPearlRaffle.reward){
//                     cumulative += reward.winners;
//                     if(i < cumulative){
//                         gradeAssigned = reward.grade;
//                         break;
//                     }
//                 }
//                 console.log(cumulative, gradeAssigned)
//                 return {
//                     name: user.firstName + ' ' + user.lastName, 
//                     lotto_number: log.id,
//                     grade: gradeAssigned
//                 }
//             }));
//             //총 참여자 수를 가져옴
//             const totalParticipants = await countPearlRaffleLogByRaffleId(pickPearlRaffle.id);

//             const data = {
//                 id: pickPearlRaffle.id,
//                 participants: totalParticipants,
//                 winners: winner,
//                 done: true
//             };
//             await insideUpdatePearlRaffle(data);
//             console.log('choose pearl raffle winner');
//         } catch (error) {
//             console.error(error);
//             throw new CustomError(400, 'already exist');
//         }
//     }, {
//         scheduled: true, 
//         timezone: "UTC"
//     });
    
// };



export const choosePearlRaffleWinnerJob = async () => {
    try {
            
        //이번 추첨 pearl래플
        const pickPearlRaffle = await getBuyablePearlRaffle();
        console.log('추첨 시작', pickPearlRaffle);
        if(pickPearlRaffle === null){
            console.log('no pearl raffle');
            throw new CustomError(400, 'PEARL_RAFFLE_NOT_FOUND');
        }

        //이번 추첨 pearl 래플에서 참여자가 최소 인원 충족 못하면 에러 발생
        const participants = await countPearlRaffleLogByRaffleId(pickPearlRaffle.id);
        if(participants < pickPearlRaffle.min_participants){
            await refundPearlRaffleJob();
            return;
        }

        let pearlRaffleArray = await getAllPearlRaffleIdArray(pickPearlRaffle.id);
        if(!pearlRaffleArray){
            throw new CustomError(400, 'PEARL_RAFFLE_LOG_NOT_FOUND');
        }
        if(pearlRaffleArray.length === 0){
            throw new CustomError(400, 'PEARL_RAFFLE_LOG_NOT_FOUND');
        }
        const numberOfWinners = pickPearlRaffle.reward.reduce((a:number, b:{ amount: number; reward_type: string; grade: number; winners: number; }) => a + b.winners, 0);

        //fisher-yates shuffle
        for (let i = pearlRaffleArray.length - 1; i > pearlRaffleArray.length - numberOfWinners -1 ; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pearlRaffleArray[i], pearlRaffleArray[j]] = [pearlRaffleArray[j], pearlRaffleArray[i]];
        }

        const winner = await Promise.all(pearlRaffleArray.slice(pearlRaffleArray.length - numberOfWinners).map(async(ticket, i) => {
            const log = await findPearlRaffleLogById(ticket.id);
            if(!log){
                throw new CustomError(400, 'PEARL_RAFFLE_LOG_NOT_FOUND');
            }
            const user = await getUserById(log.userId);
            if(!user){
                throw new CustomError(400, 'USER_NOT_FOUND');
            }

            let cumulative = 0;
            let gradeAssigned = 0;
            for (const reward of pickPearlRaffle.reward){
                cumulative += reward.winners;
                if(i < cumulative){
                    gradeAssigned = reward.grade;
                    break;
                }
            }
            console.log(cumulative, gradeAssigned)
            await createTransaction({
                fee_type: 'usdt',
                reason: 'pearl_raffle_winner',
                amount: pickPearlRaffle.reward[gradeAssigned].amount,
                from: 'company',
                to: user.id,
            })
            const asset = await getAssetByUserId({userId: user.id});
            if(!asset){
                throw new CustomError(400, 'ASSET_NOT_FOUND');
            }
            await updateAsset(user.id, {usdt: asset.usdt + pickPearlRaffle.reward[gradeAssigned].amount});
            return {
                userId: user.id,
                name: user.firstName + ' ' + user.lastName, 
                lotto_number: log.id,
                grade: gradeAssigned
            }
        }));
        //총 참여자 수를 가져옴
        const totalParticipants = await countPearlRaffleLogByRaffleId(pickPearlRaffle.id);

        const data = {
            id: pickPearlRaffle.id,
            participants: totalParticipants,
            winners: winner,
            done: true
        };
        await insideUpdatePearlRaffle(data);
        console.log('choose pearl raffle winner');
    } catch (error) {
        console.error(error);
        throw new CustomError(400, 'already exist');
    }
}


// export const chooseShellRaffleWinnerJob = () => {
//     //db에서 최근 발행된 shellRaffle을 가져옴.
//     //db에서 1개 있는 raffleBase을 가져옴.
//     //shellRaffle의 기간이 이번주(이번주 자정 ~ 토요일 23:59:59)가 지났는지 확인, 그리고 winner배열이 비었는지 확인
//     //만약 shellRaffle의 기간이 이번주가 지나지 않았거나 winner 배열이 1개 이상다면  커스텀 에러 발생(aleady exist)
//     //shellRaffle에서 participants의 수를 가져와서 랜덤으로 raffleBase의 shell_raffle_winner_number의 수만큼 추첨함
//     //winner 배열에 push
//     cron.schedule('1,11,21,31,41,51 * * * *', async () => {
//         try {
//             const pickShellRaffle = await getBuyableShellRaffle();
//             console.log('추첨 시작', pickShellRaffle);
//             if(pickShellRaffle === null){
//                 console.log('no shell raffle');
//                 throw new CustomError(400, 'SHELL_RAFFLE_NOT_FOUND');
//             }

//             const participants = await countShellRaffleLogByRaffleId(pickShellRaffle.id);
//             if(participants < pickShellRaffle.min_participants){
//                 await refundShellRaffleJob();
//                 return
//             }

//             let shellRaffleArray = await getAllShellRaffleIdArray(pickShellRaffle.id);
//             if(!shellRaffleArray){
//                 throw new CustomError(400, 'SHELL_RAFFLE_LOG_NOT_FOUND');
//             }
//             if(shellRaffleArray.length === 0){
//                 throw new CustomError(400, 'SHELL_RAFFLE_LOG_NOT_FOUND');
//             }
//             const numberOfWinners = pickShellRaffle.reward.reduce((a:number, b:{ amount: number; reward_type: string; grade: number; winners: number; }) => a + b.winners, 0);

//             for (let i = shellRaffleArray.length - 1; i > shellRaffleArray.length - numberOfWinners -1 ; i--) {
//                 const j = Math.floor(Math.random() * (i + 1));
//                 [shellRaffleArray[i], shellRaffleArray[j]] = [shellRaffleArray[j], shellRaffleArray[i]];
//             }

//             const winner = await Promise.all(shellRaffleArray.slice(shellRaffleArray.length - numberOfWinners).map(async(ticket, i) => {
//                 const log = await findShellRaffleLogById(ticket.id);
//                 if(!log){
//                     throw new CustomError(400, 'SHELL_RAFFLE_LOG_NOT_FOUND');
//                 }
//                 const user = await getUserById(log.userId);
//                 if(!user){
//                     throw new CustomError(400, 'USER_NOT_FOUND');
//                 }

//                 let cumulative = 0;
//                 let gradeAssigned = 0;
//                 for (const reward of pickShellRaffle.reward){
//                     cumulative += reward.winners;
//                     if(i < cumulative){
//                         gradeAssigned = reward.grade;
//                         break;
//                     }
//                 }
//                 console.log(cumulative, gradeAssigned)
//                 return {
//                     name: user.firstName + ' ' + user.lastName, 
//                     lotto_number: log.id,
//                     grade: gradeAssigned
//                 }
//             }));

//             const totalParticipants = await countShellRaffleLogByRaffleId(pickShellRaffle.id);

//             const data = {
//                 id: pickShellRaffle.id,
//                 participants: totalParticipants,
//                 winners: winner,
//                 done: true
//             };
//             await insideUpdateShellRaffle(data);
//             console.log('choose shell raffle winner');
//         } catch (error) {
//             console.error(error);
//             throw new CustomError(400, 'already exist');
//         }
//     }, {
//         scheduled: true, 
//         timezone: "UTC"
//     });
// };



export const chooseShellRaffleWinnerJob = async () => {
    try {
        const pickShellRaffle = await getBuyableShellRaffle();
        console.log('추첨 시작', pickShellRaffle);
        if(pickShellRaffle === null){
            console.log('no shell raffle');
            throw new CustomError(400, 'SHELL_RAFFLE_NOT_FOUND');
        }

        const participants = await countShellRaffleLogByRaffleId(pickShellRaffle.id);
        if(participants < pickShellRaffle.min_participants){
            await refundShellRaffleJob();
            return
        }

        let shellRaffleArray = await getAllShellRaffleIdArray(pickShellRaffle.id);
        if(!shellRaffleArray){
            throw new CustomError(400, 'SHELL_RAFFLE_LOG_NOT_FOUND');
        }
        if(shellRaffleArray.length === 0){
            throw new CustomError(400, 'SHELL_RAFFLE_LOG_NOT_FOUND');
        }
        const numberOfWinners = pickShellRaffle.reward.reduce((a:number, b:{ amount: number; reward_type: string; grade: number; winners: number; }) => a + b.winners, 0);

        for (let i = shellRaffleArray.length - 1; i > shellRaffleArray.length - numberOfWinners -1 ; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shellRaffleArray[i], shellRaffleArray[j]] = [shellRaffleArray[j], shellRaffleArray[i]];
        }

        const winner = await Promise.all(shellRaffleArray.slice(shellRaffleArray.length - numberOfWinners).map(async(ticket, i) => {
            const log = await findShellRaffleLogById(ticket.id);
            if(!log){
                throw new CustomError(400, 'SHELL_RAFFLE_LOG_NOT_FOUND');
            }
            const user = await getUserById(log.userId);
            if(!user){
                throw new CustomError(400, 'USER_NOT_FOUND');
            }

            let cumulative = 0;
            let gradeAssigned = 0;
            for (const reward of pickShellRaffle.reward){
                cumulative += reward.winners;
                if(i < cumulative){
                    gradeAssigned = reward.grade;
                    break;
                }
            }
            console.log(cumulative, gradeAssigned)
            await createTransaction({
                fee_type: 'usdt',
                reason: 'shell_raffle_winner',
                amount: pickShellRaffle.reward[gradeAssigned].amount,
                from: 'company',
                to: user.id,
            })
            const asset = await getAssetByUserId({userId: user.id});
            if(!asset){
                throw new CustomError(400, 'ASSET_NOT_FOUND');
            }
            await updateAsset(user.id, {usdt: asset.usdt + pickShellRaffle.reward[gradeAssigned].amount});
            return {
                userId: user.id,
                name: user.firstName + ' ' + user.lastName, 
                lotto_number: log.id,
                grade: gradeAssigned
            }
        }));

        const totalParticipants = await countShellRaffleLogByRaffleId(pickShellRaffle.id);

        const data = {
            id: pickShellRaffle.id,
            participants: totalParticipants,
            winners: winner,
            done: true
        };
        await insideUpdateShellRaffle(data);
        console.log('choose shell raffle winner');
    } catch (error) {
        console.error(error);
        throw new CustomError(400, 'already exist');
    }
}



const refundPearlRaffleJob = async() => {
    try {
        const pickedPearlRaffle = await getBuyablePearlRaffle();
        if(!pickedPearlRaffle){
            throw new CustomError(400, 'PEARL_RAFFLE_NOT_FOUND');
        }    

        const raffle_array = await getAllPearlRaffleIdArray(pickedPearlRaffle.id);
        if(raffle_array.length === 0){
            await insideUpdatePearlRaffle({id: pickedPearlRaffle.id, done: true});
            console.log('환불 종료')
            return;
        }

        raffle_array.map(async (item) => {
            const transaction = await getTransactionByReasonAndFrom(`pearl_raffle_buy.${pickedPearlRaffle.id}`, item.userId);
            if(transaction.length === 0){
                throw new CustomError(400, 'can not find pearl raffle buying transaction');
            }


            //유저 정보로 assets 불러와서 transaction에 있는 fee_type과 amount로 환불한다. 
            //환불 정보도 트랜잭션에 남긴다. 
            

            await Promise.all(transaction.map(async (item) => {
                const assets = await getAssetByUserId({userId: item.from});
                if(!assets){
                    throw new CustomError(400, 'assets not found');
                }
                if(item.fee_type === 'pearl'){
                    await createTransaction({
                        fee_type: 'pearl',
                        reason: 'pearl_raffle_refund',
                        amount: item.amount,
                        from: 'company',
                        to: item.from,
                        createdAt: Timestamp.now(),
                    });

                    await updateAsset(item.from, {pearl: assets.pearl + item.amount});
                }
            }))

            //트랜잭션 삭제
            await deletePearlRaffleLogByLogId(item.id);
        })
        await insideUpdatePearlRaffle({id: pickedPearlRaffle.id, done: true});
        console.log('환불 종료')
    } catch (error) {
        console.error(error);
        throw error;
    }
}



const refundShellRaffleJob = async() => {
    try {
        const pickedShellRaffle = await getBuyableShellRaffle();
        if(!pickedShellRaffle){
            throw new CustomError(400, 'SHELL_RAFFLE_NOT_FOUND');
        }

        //해당 래플의 총 구매자 객체 배열 가져오기
        const raffle_array = await getAllShellRaffleIdArray(pickedShellRaffle.id);
        if(raffle_array.length === 0){
            await insideUpdateShellRaffle({id: pickedShellRaffle.id, done: true});
            console.log('환불 종료')
            return;
        }

        raffle_array.map(async (item) => {
            //1개 래플 로그 객체를 이용해서 유저 아이디 뽑아내고, 특정 reason 이용해서 bahwa 트랜잭션 가져오기.
            const transaction = await getTransactionByReasonAndFrom(`shell_raffle_buy.${pickedShellRaffle.id}`, item.userId);
            if(transaction.length === 0){
                throw new CustomError(400, 'can not find shell raffle buying transaction');
            }

            //유저 정보로 assets 불러와서 transaction에 있는 fee_type과 amount로 환불한다. 
            //환불 정보도 트랜잭션에 남긴다.
            
            await Promise.all(transaction.map(async (item) => {
                //자산 가져와서
                const assets = await getAssetByUserId({userId: item.from});
                if(!assets){
                    throw new CustomError(400, 'assets not found');
                }

                //트랜잭션에 남긴다.
                if(item.fee_type === 'shell'){
                    await createTransaction({
                        fee_type: 'shell',
                        reason: 'shell_raffle_refund',
                        amount: item.amount,
                        from: 'company',
                        to: item.from,
                        createdAt: Timestamp.now(),
                    });

                    //자산 추가
                    await updateAsset(item.from, {shell: assets.shell + item.amount});
                }
            }))

            //트랜잭션 삭제
            await deleteShellRaffleLogByLogId(item.id);
        })
        await insideUpdateShellRaffle({id: pickedShellRaffle.id, done: true});
        console.log('환불 종료')
    } catch (error) {
        console.error(error);
        throw error;
    }
}