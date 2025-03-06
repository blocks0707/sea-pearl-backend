import { 
    createRouletteController, 
    updateRouletteController, 
    createProjectController,
    updateProjectController,
    createQuestController,
    updateQuestController,
    createFreeboxController,
    updateFreeboxController,
    createPearlRaffleController,
    updatePearlRaffleController,
    createShellRaffleController,
    updateShellRaffleController,
    } from "../controllers/preAdminController";

import express from 'express';


const router = express.Router();



/**
 * @swagger
 * /preadmin/creatpearlraffle:
 *   post:
 *     summary: Create a new pearl raffle
 *     tags: 
 *       - preadmin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entry_fee
 *               - entry_type
 *               - reward
 *               - period
 *               - min_participants
 *             properties:
 *               entry_fee:
 *                 type: number
 *                 description: Fee required to enter the raffle
 *               entry_type:
 *                 type: string
 *                 description: Type of entry for the raffle
 *               reward:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     amount:
 *                       type: number
 *                     reward_type:
 *                       type: string
 *                     grade:
 *                       type: number
 *                     winners:
 *                       type: number
 *               period:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     format: date-time
 *                     description: Start date of the raffle
 *                   end:
 *                     type: string
 *                     format: date-time
 *                     description: End date of the raffle
 *               min_participants:
 *                 type: number
 *                 description: Minimum number of participants required
 *     responses:
 *       200:
 *         description: Pearl raffle created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post('/creatpearlraffle', createPearlRaffleController);

/**
 * @swagger
 * /preadmin/updatespearlraffle:
 *   post:
 *     summary: Update an existing pearl raffle
 *     tags:
 *       - preadmin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID of the pearl raffle to update
 *               entry_fee:
 *                 type: number
 *                 description: Fee required to enter the raffle
 *               entry_type:
 *                 type: string
 *                 description: Type of entry for the raffle
 *               reward:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     amount:
 *                       type: number
 *                     reward_type:
 *                       type: string
 *                     grade:
 *                       type: number
 *                     winners:
 *                       type: number
 *               period:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     format: date-time
 *                     description: Start date of the raffle
 *                   end:
 *                     type: string
 *                     format: date-time
 *                     description: End date of the raffle
 *               min_participants:
 *                 type: number
 *                 description: Minimum number of participants required
 *               winners:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     grade:
 *                       type: number
 *                     name:
 *                       type: string
 *                     lotto_number:
 *                       type: string
 *               done:
 *                 type: boolean
 *                 description: Whether the raffle is completed
 *     responses:
 *       200:
 *         description: Pearl raffle updated successfully
 *       400:
 *         description: Invalid request body or missing ID
 *       500:
 *         description: Internal server error
 */
router.post('/updatespearlraffle', updatePearlRaffleController);

/**
 * @swagger
 * /preadmin/creatshellraffle:
 *   post:
 *     summary: Create a new shell raffle
 *     tags:
 *       - preadmin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entry_fee
 *               - entry_type
 *               - reward
 *               - period
 *               - min_participants
 *             properties:
 *               entry_fee:
 *                 type: number
 *                 description: Fee required to enter the raffle
 *               entry_type:
 *                 type: string
 *                 description: Type of entry for the raffle
 *               reward:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     amount:
 *                       type: number
 *                     reward_type:
 *                       type: string
 *                     grade:
 *                       type: number
 *                     winners:
 *                       type: number
 *               period:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     format: date-time
 *                     description: Start date of the raffle
 *                   end:
 *                     type: string
 *                     format: date-time
 *                     description: End date of the raffle
 *               min_participants:
 *                 type: number
 *                 description: Minimum number of participants required
 *     responses:
 *       200:
 *         description: Shell raffle created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post('/creatshellraffle', createShellRaffleController);

/**
 * @swagger
 * /preadmin/updateshellraffle:
 *   post:
 *     summary: Update an existing shell raffle
 *     tags:
 *       - preadmin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID of the shell raffle to update
 *               entry_fee:
 *                 type: number
 *                 description: Fee required to enter the raffle
 *               entry_type:
 *                 type: string
 *                 description: Type of entry for the raffle
 *               reward:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     amount:
 *                       type: number
 *                     reward_type:
 *                       type: string
 *                     grade:
 *                       type: number
 *                     winners:
 *                       type: number
 *               period:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     format: date-time
 *                     description: Start date of the raffle
 *                   end:
 *                     type: string
 *                     format: date-time
 *                     description: End date of the raffle
 *               min_participants:
 *                 type: number
 *                 description: Minimum number of participants required
 *               winners:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     grade:
 *                       type: number
 *                     name:
 *                       type: string
 *                     lotto_number:
 *                       type: string
 *               done:
 *                 type: boolean
 *                 description: Whether the raffle is completed
 *     responses:
 *       200:
 *         description: Shell raffle updated successfully
 *       400:
 *         description: Invalid request body or missing ID
 *       500:
 *         description: Internal server error
 */
router.post('/updateshellraffle', updateShellRaffleController);











/**
 * @swagger
 * /preadmin/createroulette:
 *   post:
 *     tags:
 *       - preadmin
 *     summary: Create roulette
 *     responses:
 *       200:
 *         description: Roulette created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 customCode:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.post('/createroulette',  createRouletteController);

/**
 * @swagger
 * /preadmin/updateroulette:
 *   post:
 *     tags:
 *       - preadmin
 *     summary: Update roulette
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: r1ldsfj;asdf
 *               entry:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     entry_type:
 *                       type: string
 *                       example: shell
 *                     fee:
 *                       type: number
 *                       example: 100
 *                     round:
 *                       type: number
 *                       example: 1
 *               reward:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     amount:
 *                       type: number
 *                       example: 100
 *                     reward_type:
 *                       type: string
 *                       example: shell
 *                     chance:
 *                       type: number
 *                       example: 100
 *     responses:
 *       200:
 *         description: Roulette updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 customCode:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.post('/updateroulette',  updateRouletteController);



/**
 * @swagger
 * /preadmin/createproject:
 *   post:
 *     tags:
 *       - preadmin
 *     summary: Create project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: New Game Project
 *               logo:
 *                 type: string
 *                 example: https://example.com/logo.png
 *               maxParticipants:
 *                 type: number
 *                 example: 100
 *               projectNumber:
 *                 type: number
 *                 example: 1
 *               questStartDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-02-17T00:00:00Z
 *               questEndDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-03-17T23:59:59Z
 *     responses:
 *       200:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project created successfully
 *       400:
 *         description: Invalid request body
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
router.post('/createproject',  createProjectController);

/**
 * @swagger
 * /preadmin/updateproject:
 *   post:
 *     tags:
 *       - preadmin
 *     summary: Update project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *               questStartDate:
 *                 type: string
 *                 format: date-time
 *               questEndDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 customCode:
 *                   type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 customCode:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.post('/updateproject',  updateProjectController);

/**
 * @swagger
 * /preadmin/createquest:
 *   post:
 *     tags:
 *       - preadmin
 *     summary: Create quest
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - title
 *               - reward
 *             properties:
 *               projectId:
 *                 type: string
 *                 example: project_123
 *               title:
 *                 type: string
 *                 example: Daily Login
 *               purpose:
 *                 type: string
 *                 example: User engagement
 *               reward:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: pearl
 *                     amount:
 *                       type: number
 *                       example: 50
 *               url:
 *                 type: string
 *                 example: https://example.com/quest
 *               period:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     example: "2025-02-26T00:00:00Z"
 *                   end:
 *                     type: string
 *                     example: "2025-03-26T00:00:00Z"
 *               resetCycle:
 *                 type: string
 *                 example: daily
 *               resetCount:
 *                 type: number
 *                 example: 3
 *               roundInCycle:
 *                 type: number
 *                 example: 1
 *               maxParticipants:
 *                 type: number
 *                 example: 1000
 *               enabled:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Quest created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quest created successfully
 *       400:
 *         description: Invalid request body
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
router.post('/createquest',  createQuestController);

/**
 * @swagger
 * /preadmin/updatequest:
 *   post:
 *     tags:
 *       - preadmin
 *     summary: Update quest
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - projectId
 *             properties:
 *               id:
 *                 type: string
 *               projectId:
 *                 type: string
 *               questNumber:
 *                 type: number
 *               title:
 *                 type: string
 *               purpose:
 *                 type: string
 *               reward:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     amount:
 *                       type: number
 *               url:
 *                 type: string
 *               period:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     example: "2025-02-26T00:00:00Z"
 *                   end:
 *                     type: string
 *                     example: "2025-03-26T00:00:00Z"
 *               resetCycle:
 *                 type: string
 *               resetCount:
 *                 type: number
 *               roundInCycle:
 *                 type: number
 *               maxParticipants:
 *                 type: number
 *               enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Quest updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 customCode:
 *                   type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 customCode:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.post('/updatequest',  updateQuestController);


/**
 * @swagger
 * /preadmin/updatefreebox:
 *   post:
 *     tags:
 *       - preadmin
 *     summary: Update freebox rewards configuration
 *     description: Updates the reward settings for a freebox. Can update reward types, amounts, and chances.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the freebox to update
 *               reward:
 *                 type: array
 *                 description: Array of reward configurations (optional)
 *                 items:
 *                   type: object
 *                   required:
 *                     - reward_type
 *                     - amount
 *                     - chance
 *                   properties:
 *                     reward_type:
 *                       type: string
 *                       description: Type of reward (e.g., 'pearl', 'shell')
 *                     amount:
 *                       type: number
 *                       description: Amount of reward
 *                     chance:
 *                       type: number
 *                       description: Probability of getting this reward
 *     responses:
 *       200:
 *         description: Freebox updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Freebox updated successfully"
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
 *                   example: "Invalid request body"
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
router.post('/updatefreebox',  updateFreeboxController);


/**
 * @swagger
 * /preadmin/createfreebox:
 *   post:
 *     tags:
 *       - preadmin
 *     summary: Create new freebox configuration
 *     description: Creates a new freebox with reward settings. Only one freebox can exist at a time.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reward
 *             properties:
 *               reward:
 *                 type: array
 *                 description: Array of reward configurations
 *                 items:
 *                   type: object
 *                   required:
 *                     - reward_type
 *                     - amount
 *                     - chance
 *                   properties:
 *                     reward_type:
 *                       type: string
 *                       description: Type of reward (e.g., 'pearl', 'shell')
 *                     amount:
 *                       type: number
 *                       description: Amount of reward
 *                     chance:
 *                       type: number
 *                       description: Probability of getting this reward (0-100)
 *     responses:
 *       200:
 *         description: Freebox created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Freebox created successfully"
 *       400:
 *         description: Bad request or freebox already exists
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
 *                   example: "Freebox already exists"
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
router.post('/createfreebox',  createFreeboxController);

export default router;