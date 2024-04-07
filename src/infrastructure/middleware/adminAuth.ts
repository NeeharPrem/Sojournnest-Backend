import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            adminId?: string;
        }
    }
}

export const adminProtect = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.adminJWT;
     console.log(token)
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
            if (decoded.role === 'admin') {
                req.adminId = decoded.id;
                next();
            } else {
                return res.status(401).json({ message: "Not authorized, invalid role" });
            }
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }
    } else {
        return res.status(401).json({ message: "Not authorized, token not found" });
    }
};