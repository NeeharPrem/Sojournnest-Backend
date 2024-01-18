import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response,NextFunction} from 'express';
import userRepository from '../repository/userRepository';

const userRepo= new userRepository()


declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.cookies.userJWT;

        if (!token) {
            return res.status(401).json({ message: "Access Denied" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        if (!decoded || (decoded.role && decoded.role !== 'user')) {
            return res.status(401).json({ message: 'Not authorized, invalid token' });
        }
        const user = await userRepo.findById(decoded.userId as string);
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, invalid token' });
        }
        req.userId = user._id;
        if (user.is_blocked) {
            return res.status(401).json({ message: 'You are blocked by admin!' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};