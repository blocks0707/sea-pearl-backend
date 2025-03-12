import { buyPearlController, buyShellController, getShellController, getPearlController } from "../controllers/raffleController";
import express from "express";
//import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /raffle/buypearl:
 *   post:
 *     tags:
 *       - raffle
 *     summary: Buy pearl
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
 *     responses:
 *       200:
 *         description: Pearl bought successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 raffleId:
 *                   type: string
 *                   description: Raffle ID
 *                 lotto_number: 
 *                   type: number
 *                   description: Lotto number
 *                 fee: 
 *                   type: number
 *                   description: Fee
 *                 start: 
 *                   type: number
 *                   description: 시작일
 *                 end: 
 *                   type: number
 *                   description: 종료일
 *                 participants:
 *                   type: number
 *                   description: 참가자 수
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   description: Error status code
 *                   example: 400
 *                 customCode:
 *                   type: string
 *                   description: Custom error code
 *                   example: rfl-0001 
 *                 message:
 *                   type: string
 *                   description: Error message
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
 *                   description: Internal server error
 *                   example: 500
 *                 customCode:
 *                   type: string
 *                   description: Custom error code
 *                   example: ERR_INTERNAL_SERVER
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
router.post('/buypearl', buyPearlController);


/**
 * @swagger
 * /raffle/buyshell:
 *   post:
 *     tags:
 *       - raffle
 *     summary: Buy shell
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
 *     responses:
 *       200:
 *         description: Shell bought successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 raffleId:
 *                   type: string
 *                   description: Raffle ID
 *                 lotto_number: 
 *                   type: number
 *                   description: Lotto number
 *                 fee: 
 *                   type: number
 *                   description: Fee
 *                 start: 
 *                   type: number
 *                   description: 시작일
 *                 end: 
 *                   type: number
 *                   description: 종료일
 *                 participants:
 *                   type: number
 *                   description: 참가자 수
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Bad request
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Internal server error
 */ 
router.post('/buyshell', buyShellController);


/**
 * @swagger
 * /raffle/getshell:
 *   get:
 *     tags:
 *       - raffle
 *     summary: Get shell
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shell retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                   description: Raffle count
 *                   example: 0
 *                 lastWeekShellRaffle:
 *                   type: object
 *                   properties:
 *                     raffleId:
 *                       type: string
 *                       description: Raffle ID
 *                       example: "raffle1"
 *                     entry_fee:
 *                       type: number
 *                       description: Raffle entry fee
 *                       example: 0
 *                     start:
 *                       type: string
 *                       description: Raffle start
 *                       example: "2021-01-01T00:00:00.000Z"
 *                     end:
 *                       type: string
 *                       description: Raffle end
 *                       example: "2021-01-01T00:00:00.000Z"
 *                     participants:
 *                       type: number
 *                       description: Raffle participants
 *                       example: 889
 *                     participant_count:
 *                       type: number
 *                       description: Raffle participant count
 *                       example: 3
 *                     winner:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: Raffle name
 *                             example: "Super man"
 *                           grade:
 *                             type: number
 *                             description: Raffle grade
 *                             example: 1
 *                           amount:
 *                             type: number
 *                             description: Raffle amount
 *                             example: 100
 *                     prize:
 *                       type: string
 *                       description: Raffle prize
 *                       example: "100"
 *                     reward:
 *                       type: object
 *                       properties:
 *                         amount:
 *                           type: number
 *                           description: amount
 *                           example: 100
 *                         reward_type:
 *                           type: string
 *                           description: reward type
 *                           example: usdt
 *                         grade:
 *                           type: number
 *                           description: grade
 *                           example: 1
 *                         winners:
 *                           type: number
 *                           description: winners
 *                           example: 1
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Bad request
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Internal server error
 */
router.get('/getshell', getShellController);

/**
 * @swagger
 * /raffle/getpearl:
 *   get:
 *     tags:
 *       - raffle
 *     summary: Get pearl
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pearl retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                   description: Raffle count
 *                   example: 0
 *                 lastWeekPearlRaffle:
 *                   type: object
 *                   properties:
 *                     raffleId:
 *                       type: string
 *                       description: Raffle ID
 *                       example: "Super man"
 *                     entry_fee:
 *                       type: number
 *                       description: Raffle entry fee
 *                       example: 0
 *                     start:
 *                       type: string
 *                       description: Raffle start
 *                       example: "2021-01-01T00:00:00.000Z"
 *                     end:
 *                       type: string
 *                       description: Raffle end
 *                       example: "2021-01-01T00:00:00.000Z"
 *                     participants:
 *                       type: number
 *                       description: Raffle participants
 *                       example: 1010
 *                     prize:
 *                       type: string
 *                       description: Raffle prize
 *                       example: "100"
 *                     winner:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: Raffle name
 *                             example: "Super man"
 *                           grade:
 *                             type: number
 *                             description: Raffle grade
 *                             example: 1
 *                           amount:
 *                             type: number
 *                             description: Raffle amount
 *                             example: 100
 *                     participant_count:
 *                       type: number
 *                       description: Raffle participant count
 *                       example: 0
 *                     reward:
 *                       type: object
 *                       properties:
 *                         amount:
 *                           type: number
 *                           description: amount
 *                           example: 100
 *                         reward_type:
 *                           type: string
 *                           description: reward type
 *                           example: usdt
 *                         grade:
 *                           type: number
 *                           description: grade
 *                           example: 1
 *                         winners:
 *                           type: number
 *                           description: winners
 *                           example: 1
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Bad request
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Internal server error
 */
router.get('/getpearl', getPearlController);

export default router;