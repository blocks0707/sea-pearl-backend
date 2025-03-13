import express from 'express';
import { getMining, upgradeMining, upgradeStorage, movePearlToAssetController } from '../controllers/miningContoller';
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



/**
 * @swagger
 * /mining/movepearltoasset:
 *   post:
 *     tags:
 *       - mining
 *     summary: 패시브 채굴된 진주를 자산으로 이동
 *     requestBody:
 *       description: 유저 ID
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
 *         description: 진주가 성공적으로 자산으로 이동됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Move pearl to asset successfully
 *       400:
 *         description: 잘못된 요청
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
 *       404:
 *         description: 리소스를 찾을 수 없음
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
 *         description: 서버 내부 오류
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
router.post('/movepearltoasset', movePearlToAssetController);

export default router;