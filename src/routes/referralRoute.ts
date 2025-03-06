import {sendMessageController, getFriendsController} from '../controllers/referralController';
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /referral/sendmessage:
 *   post:
 *     tags:
 *       - referral
 *     summary: Send a message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - inviteeHandle
 *             properties:
 *               userId:
 *                 type: string
 *               inviteeHandle:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                    type: string
 *                    description: success
 *                    example: "success"
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
 *                   type: number
 *                   description: Custom error code
 *                   example: ERR_INVALID_REQUEST_BODY
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Invalid request body"    
 *   
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     statusCode:
 *                       type: number
 *                       description: Error status code
 *                       example: 500
 *                     customCode:
 *                       type: number
 *                       description: Custom error code
 *                       example: ERR_INTERNAL_SERVER
 *                     message:
 *                       type: string
 *                       description: Error message
 *                       example: "Internal Server Error"
 */
router.post('/sendmessage', authMiddleware, sendMessageController);


/** 
 * @swagger
 * /referral/getfriends:
 *   post:
 *     tags:
 *       - referral
 *     summary: Get friends
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
 *         description: Friends retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 friends:
 *                   type: array
 *                   userId:
 *                     type: string
 *                     description: User ID
 *                   guestId:
 *                     type: string
 *                     description: Guest ID
 *                   accepted:
 *                     type: boolean    
 *                     description: Accepted status
 *                   createdAt:
 *                     type: string
 *                     description: Creation time
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
 *                   type: number
 *                   description: Custom error code
 *                   example: ERR_INVALID_REQUEST_BODY
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
router.post('/getfriends', authMiddleware, getFriendsController);

export default router;