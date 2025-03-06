import {getPlayController, getNowEntryController} from "../controllers/rouletteController";
import express from "express";
import {authMiddleware} from "../middlewares/authMiddleware";

const router = express.Router();


/**
 * @swagger
 * /roulette/play:
 *   post:
 *     tags:
 *       - roulette
 *     summary: Play roulette
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
 *         description: Roulette played successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   description: Roulette type
 *                 amount:
 *                   type: number
 *                   description: Roulette amount
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
 *                   example: rlt-0001
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
router.post('/play', authMiddleware, getPlayController);


/**
 * @swagger
 * /roulette/nowEntry:
 *   get:
 *     tags:
 *       - roulette
 *     summary: Get now entry
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Now entry retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   description: Roulette type
 *                 amount:
 *                   type: number
 *                   description: Roulette amount
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
 *                   example: rlt-0001
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
router.get('/nowEntry', authMiddleware, getNowEntryController);


export default router;