import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthRequest extends Request {
    user?: { userId: string; email: string };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.headers?.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ success: false, message: 'Token required' });
        return;
    }

    jwt.verify(token, env.jwtSecret, (err: Error | null, decoded: unknown) => {
        if (err) {
            res.status(403).json({ success: false, message: 'Invalid token' });
            return;
        }
        req.user = decoded as AuthRequest['user'];
        next();
    });
};
