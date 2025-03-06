import express from 'express';
import {openFreeboxController, getRestBoxController} from '../controllers/freeboxController';
//import {authMiddleware} from '../middlewares/authMiddleware';

const router = express.Router();


/**
 * @swagger
 * /freebox/getfreebox:
 *   post:
 *     tags:
 *       - freebox
 *     summary: Open freebox
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
 *         description: Freebox opened successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reward_type:
 *                   type: string
 *                   description: 리워드 자원 종류
 *                 amount:
 *                   type: number
 *                   description: 리워드 자원 양
 *                 rest:
 *                   type: number
 *                   description: 무한 노문의 노문
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post('/getfreebox', openFreeboxController);


/**
 * @swagger
 * /freebox/getrestbox:
 *   get:
 *     tags:
 *       - freebox
 *     summary: Get remaining freebox count for a user
 *     description: Returns how many more freeboxes a user can open (max 30 per day)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User's unique identifier
 *     responses:
 *       200:
 *         description: Successfully retrieved remaining box count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rest Box Count successfully"
 *                 result:
 *                   type: number
 *                   description: Number of remaining boxes user can open
 *                   example: 25
 *       400:
 *         description: Invalid request body or userId
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
 *                   example: "ERR_INVALID_REQUEST_BODY"
 *                 message:
 *                   type: string
 *                   example: "Invalid request body"
 *       404:
 *         description: Asset not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 customCode:
 *                   type: string
 *                   example: "ERR_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "Asset not found"
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
 *                   example: "ERR_INTERNAL_SERVER"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/getrestbox', getRestBoxController);

export default router;