import {gameController, addPearlController, getTokenController} from "../controllers/gameController";
import express from "express";
//import {authMiddleware} from "../middlewares/authMiddleware";

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
 *               initData:
 *                 type: string
 *                 description: Telegram WebApp에서 제공하는 initData 문자열
 *             required:
 *               - initData
 *             example: {
 *               "initData": "query_id=AAEwz8BfAwAAADDPwF8U2vHs&user=%7B%22id%22%3A8048922416%2C%22first_name%22%3A%22ANTTIME%22%2C%22last_name%22%3A%22Official%22%2C%22username%22%3A%22ANTTIME_Official%22%2C%22language_code%22%3A%22ko%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FQwC44Fl4kgR6WlsTrt_vPQJjGiAAR2N5IzYfuOKHRXc1ILqRFUugYaPcEFxXTVi7.svg%22%7D&auth_date=1741322941&signature=_V9nzBOfArF76w1mfjbtsy_6LfuL1o_cAB2oIrptqrudm6l0F6vVOaUA0jPK6rGOjwTsf_IeUHflX4_VBCdVAw&hash=81d59214f0479ae1af278b9d5799e3b3028026252208034766dcad49118c7ebe"
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
router.post('/addpearl', addPearlController);


/**
 * @swagger
 * /game/gettoken:
 *   post:
 *     tags:
 *       - game
 *     summary: 액세스 토큰과 리프레시 토큰을 발급받습니다.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 토큰이 성공적으로 발급됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: 액세스 토큰 (12시간 유효)
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       description: 리프레시 토큰 (24시간 유효)
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   description: 상태 코드
 *                   example: 401
 *                 customCode:
 *                   type: string
 *                   description: 커스텀 코드
 *                   example: ERR_UNAUTHORIZED
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: Unauthorized
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   description: 상태 코드
 *                   example: 500
 *                 customCode:
 *                   type: string
 *                   description: 커스텀 코드
 *                   example: ERR_INTERNAL_SERVER
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: Internal server error
 */
router.post('/gettoken', getTokenController);

export default router;