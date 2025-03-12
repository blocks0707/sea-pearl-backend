import express from 'express';
import { getMining, upgradeMining, upgradeStorage } from '../controllers/miningContoller';
//import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();


/**
 * @swagger
 * /mining/getmining:
 *   get:
 *     tags:
 *       - mining
 *     summary: Get mining status
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mining status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 storage_level:
 *                   type: number
 *                   description: 현재 스토리지 레벨
 *                 now_storage:
 *                   type: number
 *                   description: 현재 스토리지 양
 *                 storageUpgradeFee:
 *                   type: string
 *                   description: 스토리지 업그레이드 요금
 *                 fassive_level:
 *                   type: number
 *                   description: 현재 파시브 레벨
 *                 now_fassive:
 *                   type: number
 *                   description: 현재 파시브 양
 *                 miningUpgradeFee:
 *                   type: string
 *                   description: 마이닝 업그레이드 요금
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
router.get('/getmining', getMining);


/**
 * @swagger
 * /mining/upgrademining:
 *   post:
 *     tags:
 *       - mining   
 *     summary: Upgrade mining
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
 *         description: Mining upgraded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mining upgraded successfully
 * 
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
router.post('/upgrademining', upgradeMining);

/**
 * @swagger
 * /mining/upgradestorage:
 *   post:
 *     tags:
 *       - mining   
 *     summary: Upgrade storage
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
 *         description: Storage upgraded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Storage upgraded successfully
 * 
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
router.post('/upgradestorage', upgradeStorage);

export default router;