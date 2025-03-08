import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; 
import { config } from '../config'
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const decodedToken = jwt.verify(token, config.JWT_SECRET) as { id: string };
    const userId = decodedToken.id;
    req.user = { id: userId };
    next();
}