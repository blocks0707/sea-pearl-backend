import {gameController, addPearlController} from "../controllers/gameController";
import express from "express";
import {authMiddleware} from "../middlewares/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /game/start:
 *   post:
 *     tags:
 *       - game
 *     summary: 여기가 메인입니다. 진입점.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query_id:
 *                 type: string
 *               user:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   language_code:
 *                     type: string
 *                   allows_write_to_pm:
 *                     type: boolean
 *                   photo_url:
 *                     type: string
 *               auth_date:
 *                 type: string
 *               signature:
 *                 type: string
 *               hash:
 *                 type: string
 *             example: {
 *               "query_id": "AAHHG_BfAwAAAMcb8F_uTrxP",
 *               "user": {
 *                 "id": 8052022215,
 *                 "first_name": "Jacky",
 *                 "last_name": "",
 *                 "language_code": "ko",
 *                 "allows_write_to_pm": true,
 *                 "photo_url": "https://t.me/i/userpic/320/9W6RhJjcNOTP45DHEKIlG0qaf9g4sdEU_aU5qjTNxoz0aPZJukrc1fti_rnL9hv4.svg"
 *               },
 *               "auth_date": "1736494140",
 *               "signature": "J4PkSD4j2uwclAvnSe6vxLTZm0Jf27Otz7da0CoWdo5DAEAgSE299uPySyViBd0K79GqjBxerSKYl_lguPRRAw",
 *               "hash": "5ca5e67af349e936972e988e66c36e9737fff129d17b2cbc54196812823eb4c5"
 *             }
 *     responses:
 *       200:
 *         description: Game played successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                      id:
 *                        type: string
 *                        description: User ID
 *                        example: baa09w38745q09ghfapdg
 *                      telegramUid:
 *                        type: string
 *                        description: 텔레그램 uid
 *                        example: 123456789aoigupqopqweioiqewutupoqwe
 *                      telegramFirstName:
 *                        type: string
 *                        description: telegram first name
 *                        example: block
 *                      telegramLastName:
 *                        type: string
 *                        description: telegram last name
 *                        example: block
 *                      createdAt:
 *                        type: string
 *                        description: Created at
 *                        example: 2025-03-01T00:00:00.000Z
 *                      updatedAt:
 *                        type: string
 *                        description: Updated at
 *                        example: 2025-03-01T00:00:00.000Z
 *                 asset:
 *                   type: object
 *                   description: asset object
 *                   properties:
 *                      id:
 *                        type: string
 *                        description: Asset ID
 *                        example: baa09w38745q09ghfapdg
 *                      shell:
 *                        type: number
 *                        description: shell
 *                        example: 2000
 *                      pearl:
 *                        type: number  
 *                        description: pearl
 *                        example: 2000
 *                      usdt:
 *                        type: number
 *                        description: usdt
 *                        example: 2000
 *                 mining:
 *                   type: object
 *                   description: mining
 *                   properties:
 *                      id:
 *                        type: string
 *                        description: Mining ID
 *                        example: baa09w38745q09ghfapdg
 *                      active:
 *                        type: number
 *                        description: 현재 스토리지 레벨
 *                        example: 1
 *                      now_storage:
 *                        type: number
 *                        description: 현재 스토리지 양
 *                        example: 1
 *                 access_token:
 *                   type: string
 *                   description: Access token
 *                   example: eys;ldkjgsjadg9098709a8s7g098709asd87g
 *                 refresh_token:
 *                   type: string
 *                   description: Refresh token
 *                   example: ey-sdlkgjho;aisdghpoiashdgpoaishgp
 *       400:
 *         description:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   description: status code
 *                   example: 404
 *                 customCode:
 *                   type: string
 *                   description: custom code
 *                   example: game-0001
 *                 message:
 *                   type: string
 *                   description: 메시지
 *                   example: Not found
 *       500:
 *         description:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   description: status code
 *                   example: 500
 *                 customCode:
 *                   type: string
 *                   description: custom code
 *                   example: game-0002
 *                 message:
 *                   type: string
 *                   description: 메시지
 *                   example: Internal server error
 */
router.post('/start', gameController);


/**
 * @swagger
 * /game/addpearl:
 *   post:
 *     tags:
 *       - game
 *     summary: 탭하고 나서 얻는 pearl
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - pearl
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID
 *                 example: baa09w38745q09ghfapdg
 *               pearl:
 *                 type: number
 *                 description: Pearl
 *                 example: 2000
 *     responses:
 *       200:
 *         description: Pearl added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Pearl added successfully
 *                   example: Pearl added successfully
 *       400:
 *         description:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   description: status code
 *                   example: 404
 *                 customCode:
 *                   type: string
 *                   description: custom code
 *                   example: game-0001
 *                 message:
 *                   type: string
 *                   description: 메시지
 *                   example: Not found
 *       500:
 *         description:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   description: status code
 *                   example: 500
 *                 customCode:
 *                   type: string
 *                   description: custom code
 *                   example: game-0002
 *                 message:
 *                   type: string
 *                   description: 메시지
 *                   example: Internal server error
 */
router.post('/addpearl', authMiddleware, addPearlController);

export default router;