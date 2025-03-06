import express from 'express';
import {getAllProjectsController, getCategorizedQuestsController, achieveQuestController, visitQuestProgressController} from '../controllers/questController';
import {authMiddleware} from '../middlewares/authMiddleware';

const router = express.Router();
/**
 * @swagger
 * /quest/getallprojects:
 *   get:
 *     tags:
 *       - quest
 *     summary: Get all projects with their total rewards
 *     description: Retrieves all projects and calculates the sum of rewards for each type (pearl, shell, etc.)
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to get projects for
 *     responses:
 *       200:
 *         description: Successfully retrieved projects with reward summaries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   projectId:
 *                     type: string
 *                     description: Unique identifier of the project
 *                     example: "project-123"
 *                   projectName:
 *                     type: string
 *                     description: Name of the project
 *                     example: "Sample Project"
 *                   projectNumber:
 *                     type: number
 *                     description: Project sequence number
 *                     example: 1
 *                   projectLogo:
 *                     type: string
 *                     description: URL of the project logo
 *                     example: "https://example.com/logo.png"
 *                   rewards:
 *                     type: object
 *                     description: Total sum of rewards by type
 *                     example:
 *                       pearl: 300
 *                       shell: 200
 *                     properties:
 *                       pearl:
 *                         type: number
 *                         description: Total amount of pearl rewards
 *                       shell:
 *                         type: number
 *                         description: Total amount of shell rewards
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 customCode:
 *                   type: string
 *                   example: ERR_INVALID_REQUEST
 *                 message:
 *                   type: string
 *                   example: "Invalid request"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 customCode:
 *                   type: string
 *                   example: ERR_INTERNAL_SERVER
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/getallprojects', getAllProjectsController);


/**
 * @swagger
 * /quest/getcategorizedquests:
 *   get:
 *     tags:
 *       - quest
 *     summary: Get categorized quests by reset cycle
 *     description: Retrieves quests categorized by their reset cycle (daily, weekly, monthly, none) and checks if they are enabled based on user's latest completion
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to check quest completion status
 *       - in: query
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the project to get quests for
 *     responses:
 *       200:
 *         description: Quest information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 daily:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       reward:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             type:
 *                               type: string
 *                             amount:
 *                               type: number
 *                       url:
 *                         type: string
 *                       remainingRound:
 *                         type: number
 *                       achievedRound:
 *                         type: number
 *                       enabled:
 *                         type: boolean
 *                 weekly:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       reward:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             type:
 *                               type: string
 *                             amount:
 *                               type: number
 *                       url:
 *                         type: string
 *                       remainingRound:
 *                         type: number
 *                       achievedRound:
 *                         type: number
 *                       enabled:
 *                         type: boolean
 *                 monthly:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       reward:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             type:
 *                               type: string
 *                             amount:
 *                               type: number
 *                       url:
 *                         type: string
 *                       remainingRound:
 *                         type: number
 *                       achievedRound:
 *                         type: number
 *                       enabled:
 *                         type: boolean
 *                 none:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       reward:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             type:
 *                               type: string
 *                             amount:
 *                               type: number
 *                       url:
 *                         type: string
 *                       enabled:
 *                         type: boolean
 *                       remainingRound:
 *                         type: number
 *                       achievedRound:
 *                         type: number
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 customCode:
 *                   type: string
 *                   example: ERR_INVALID_REQUEST_BODY
 *                 message:
 *                   type: string
 *                   example: Invalid request body
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 customCode:
 *                   type: string
 *                   example: ERR_INTERNAL_SERVER
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/getcategorizedquests',  getCategorizedQuestsController);


/**
 * @swagger
 * /quest/achievequest:
 *   post:
 *     tags:
 *       - quest
 *     summary: Achieve a quest and update progress or get rewards
 *     description: Records quest progress. If it's the final round, rewards are given and added to user's assets.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - questId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user achieving the quest
 *               questId:
 *                 type: string
 *                 description: ID of the quest being achieved
 *     responses:
 *       200:
 *         description: Quest achieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                   description: Success status code
 *                 customCode:
 *                   type: string
 *                   example: OK
 *                   description: Success custom code
 *                 message:
 *                   type: string
 *                   example: Quest achieved
 *                   description: Success message
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                   description: Error status code
 *                 customCode:
 *                   type: string
 *                   example: ERR_INVALID_REQUEST_BODY
 *                   description: Custom error code
 *                 message:
 *                   type: string
 *                   example: Invalid request body
 *                   description: Error message
 *             examples:
 *               invalidBody:
 *                 value:
 *                   statusCode: 400
 *                   customCode: ERR_INVALID_REQUEST_BODY
 *                   message: Invalid request body
 *               questAchieved:
 *                 value:
 *                   statusCode: 400
 *                   customCode: ERR_INVALID_REQUEST_BODY
 *                   message: Quest already achieved
 *               questNotFound:
 *                 value:
 *                   statusCode: 404
 *                   customCode: ERR_NOT_FOUND
 *                   message: Quest not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                   description: Error status code
 *                 customCode:
 *                   type: string
 *                   example: ERR_INTERNAL_SERVER
 *                   description: Custom error code
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                   description: Error message
 */
router.post('/achievequest', authMiddleware, achieveQuestController);



/**
 * @swagger
 * /quest/visitquestprogress:
 *   post:
 *     summary: 퀘스트 진행 상태 확인
 *     description: 사용자의 특정 퀘스트 진행 상태를 확인합니다.
 *     tags:
 *       - quest
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - questId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 사용자 ID
 *               questId:
 *                 type: string
 *                 description: 퀘스트 ID
 *     responses:
 *       200:
 *         description: 퀘스트 진행 상태 확인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 퀘스트 ID
 *                   example: "quest123"
 *                 questNumber:
 *                   type: number
 *                   description: 퀘스트 번호
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: 퀘스트 제목
 *                   example: "첫 번째 퀘스트"
 *                 reward:
 *                   type: array
 *                   description: 퀘스트 보상 정보
 *                   items:
 *                     type: object
 *                     properties:
 *                       amount:
 *                         type: number
 *                         example: 100
 *                       reward_type:
 *                         type: string
 *                         example: "pearl"
 *                 url:
 *                   type: string
 *                   description: 퀘스트 URL
 *                   example: "https://example.com/quest"
 *                 remainingRound:
 *                   type: number
 *                   description: 남은 라운드 수
 *                   example: 0
 *                 achievedRound:
 *                   type: number
 *                   description: 달성한 라운드 수
 *                   example: 3
 *                 resetCycle:
 *                   type: string
 *                   description: 리셋 주기
 *                   example: "daily"
 *                 completed:
 *                   type: boolean
 *                   description: 완료 여부
 *                   example: true
 *                 enabledToClaim:
 *                   type: boolean
 *                   description: 보상 수령 가능 여부
 *                   example: true
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 customCode:
 *                   type: string
 *                   example: ERR_INVALID_REQUEST_BODY
 *                 message:
 *                   type: string
 *                   example: Invalid request body
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 customCode:
 *                   type: string
 *                   example: ERR_INTERNAL_SERVER
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/visitquestprogress', authMiddleware, visitQuestProgressController);


export default router;