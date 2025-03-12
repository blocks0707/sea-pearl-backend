import {getWalletHistory} from "../controllers/walletHistoryController";
import express from "express";
//import {authMiddleware} from "../middlewares/authMiddleware";

const router = express.Router();



/** 
 * @swagger
 * /wallethistory/history:
 *   get:
 *     tags:
 *       - walletHistory
 *     summary: Get wallet history
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wallet history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   fee_type:
 *                     type: string
 *                     description: Transaction fee type
 *                     example: "shell"
 *                   amount:
 *                     type: number
 *                     description: Transaction amount
 *                     example: 100
 *                   reason:
 *                     type: string
 *                     description: Transaction reason
 *                     example: "freebox_open"
 *                   from:
 *                     type: string
 *                     description: Transaction from
 *                     example: "company"
 *                   to:
 *                     type: string
 *                     description: Transaction to
 *                     example: "userId"
 *                   createdAt:
 *                     type: string
 *                     description: Transaction created at
 *                     example: "2023-03-01T00:00:00.000Z"
 *       400:
 *         description: Some server error
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
 *                   example: wh-0001
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
router.get('/history', getWalletHistory);

export default router;