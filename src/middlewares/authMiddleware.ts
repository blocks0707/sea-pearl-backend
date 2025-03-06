import { Request, Response, NextFunction } from 'express';
import {RequestHandler} from 'express';
import {verifyAccessToken, verifyRefreshToken, accessToken, refreshToken} from '../models/userModel';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

//구글 auth
export const authMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('authMiddleware 실행')
        //http-only 사용할 때.
        // const access = req.cookies.access;
        // const refresh = req.cookies.refresh;

        const access = req.headers.authorization?.split(' ')[1];
        const refresh = Array.isArray(req.headers['x-refresh-token']) ? req.headers['x-refresh-token'][0] : req.headers['x-refresh-token'];

        // Access Token이 없는 경우
        if (!access) {
            res.status(401).json({
                message: 'Access token missing',
                code: 'ERR_ACCESS_TOKEN_MISSING',
            });
            return;
        }

        try {
            // Access Token 유효성 검사
            const decoded = await verifyAccessToken(access);
            console.log(decoded);
            next(); // 요청 계속 진행
            return;
        } catch (error) {
            // Access Token 만료 확인
            if (error instanceof jwt.TokenExpiredError) {
                console.log('Access Token expired. Checking Refresh Token...');

                // Refresh Token 검증
                if (!refresh) {
                    res.status(401).json({
                        message: 'Refresh token missing',
                        code: 'ERR_REFRESH_TOKEN_MISSING',
                    });
                    return;
                }

                const refreshData = await verifyRefreshToken(refresh);
                if (!refreshData) {
                    res.status(403).json({
                        message: 'Invalid refresh token',
                        code: 'ERR_INVALID_REFRESH_TOKEN',
                    });
                    return;
                }

                // 새로운 Access Token과 Refresh Token 발급
                const newAccessToken = await accessToken();
                const newRefreshToken = await refreshToken();

                // 쿠키에 새로운 토큰 저장
                // res.cookie('access', newAccessToken, {
                //     httpOnly: true,
                //     secure: true,
                //     sameSite: 'none',
                //     maxAge: 12 * 60 * 60 * 1000,
                // });
                // res.cookie('refresh', newRefreshToken, {
                //     httpOnly: true,
                //     secure: true,
                //     sameSite: 'none',
                //     maxAge: 24 * 60 * 60 * 1000,
                // });

                res.setHeader('access', newAccessToken);
                res.setHeader('refresh', newRefreshToken);
                next();
                return;
            }

            // Access Token이 만료된 것이 아니라 다른 에러 발생
            res.status(403).json({
                message: 'Invalid access token',
                code: 'ERR_INVALID_ACCESS_TOKEN',
            });
            return;
        }
    } catch (error) {
        console.error('Authentication Middleware Error:', error);
        res.status(500).json({
            message: 'Internal server error',
            code: 'ERR_INTERNAL_SERVER',
        });
        return;
    }
};