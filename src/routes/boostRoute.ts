import express from 'express';
import { getBoost, doubleXBoost, fourXBoost } from '../controllers/boostController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();


/**
 * @swagger
 * /boost/screen:
 *   get:
 *     tags:
 *       - boost
 *     summary: Get boost status
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Boost status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doublexboost_before:
 *                   type: string
 *                   description: 2부스트 전, 현재 채굴양
 *                 doublexboost_after:
 *                   type: string
 *                   description: 2부스트 후, 예상 채굴양
 *                 fourxboost_before:
 *                   type: string
 *                   description: 4부스트 전, 현재 채굴양
 *                 fourxboost_after:
 *                   type: string
 *                   description: 4부스트 후, 예상 채굴양
 *       500:
 *         description: Internal server error
 */
router.get('/screen', authMiddleware, getBoost);


/**
 * @swagger
 * /boost/doublexboost:
 *   post:
 *     tags:
 *       - boost
 *     summary: Double X boost
 *     requestBody:
 *       description: User ID
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
 *         description: Double X boost successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mining_amount:
 *                   type: number
 *                   description: 2부스트 동안 채굴할 양
 *                 boost_endAt:
 *                   type: number
 *                   description: 부스트 완료 시간
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.post('/doublexboost', authMiddleware, doubleXBoost);


/**
 * @swagger
 * /boost/fourxboost:
 *   post:
 *     tags:
 *       - boost
 *     summary: Four X boost
 *     requestBody:
 *       description: User ID
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
 *         description: Four X boost successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mining_amount:
 *                   type: number
 *                   description: 4부스트 동안 채굴할 양
 *                 boost_endAt:
 *                   type: number
 *                   description: 부스트 완료 시간
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.post('/fourxboost', authMiddleware, fourXBoost);

export default router;