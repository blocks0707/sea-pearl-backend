import {walletController, withdrawController, walletAddressUpdateController} from "../controllers/walletController";
import express from "express";
//import {authMiddleware} from "../middlewares/authMiddleware";

const router = express.Router();


/**
 * @swagger
 * /wallet/showlist:
 *   post:
 *     tags:
 *       - wallet
 *     summary: Get wallet balance
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
 *         description: Wallet balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usdt:
 *                   type: number
 *                   description: USDT balance
 *                   example: 100
 *                 walletAddress:
 *                   type: string
 *                   description: Wallet address
 *                   example: 0x1234567890
 *       400:
 *         description: Invalid request body
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
 *                   example: wlt-0001
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
 *                   description: Error status code
 *                   example: 500
 *                 customCode:
 *                   type: number
 *                   description: Custom error code
 *                   example: ERR_INTERNAL_SERVER
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
router.post('/showlist', walletController);

/**
 * @swagger
 * /wallet/withdraw:
 *   post:
 *     tags:
 *       - wallet
 *     summary: Withdraw from wallet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - amount
 *             properties:
 *               userId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Withdraw success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Withdraw success
 *                   example: "Withdraw success"
 *       400:
 *         description: Invalid request body
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
 *                   example: wwd
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
 *                   description: Error status code
 *                   example: 500
 *                 customCode:
 *                   type: number
 *                   description: Custom error code
 *                   example: ERR_INTERNAL_SERVER
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
router.post('/withdraw', withdrawController);


/**
 * @swagger
 * /wallet/addressupdate:
 *   post:
 *     tags:
 *       - wallet
 *     summary: Update wallet address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - walletAddress
 *             properties:
 *               userId:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Wallet address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Wallet address updated successfully"
 *       400:
 *         description: Invalid request body
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
 *                   example: wwd
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
 *                   description: Error status code
 *                   example: 500
 *                 customCode:
 *                   type: number
 *                   description: Custom error code
 *                   example: ERR_INTERNAL_SERVER
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
router.post('/addressupdate', walletAddressUpdateController);

export default router;