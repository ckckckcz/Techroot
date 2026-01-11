import express from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { ExpressRequest, ExpressResponse, ExpressNextFunction } from '../types/express.d';

export interface AuthRequest extends ExpressRequest {
    user: { userId: string; email: string };
}

export const authenticateToken = (
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNextFunction
): void => {
    const authHeader = req.headers?.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        res.status(401).json({ success: false, message: 'Token required' });
        return;
    }

    jwt.verify(token, env.jwtSecret, (err: Error | null, decoded: unknown) => {
        if (err) {
            res.status(403).json({ success: false, message: 'Invalid token' });
            return;
        }
        (req as AuthRequest).user = decoded as AuthRequest['user'];
        next();
    });
};
