import {getProfileController} from "../controllers/profileController";
import express from 'express';
//import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /profile/showprofile:
 *   get:
 *     tags:
 *       - profile
 *     summary: Get profile
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: User ID
 *                 firstName:
 *                   type: string
 *                   description: First name
 *                 lastName:
 *                   type: string
 *                   description: Last name
 *                 telegramUid:
 *                   type: string
 *                   description: Telegram UID
 *                 score:
 *                   type: object
 *                   description: Score
 *                   properties:
 *                     shell:
 *                       type: number
 *                       description: Shell score
 *                     pearl:
 *                       type: number
 *                       description: Pearl score
 *                     usdt:
 *                       type: number
 *                       description: USDT score
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
router.get('/showprofile', getProfileController);


export default router;