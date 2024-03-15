import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import userRepository from '../repository/userRepository';
import JWTToken from '../passwordRepository/jwtpassword';

const userRepo = new userRepository();
const jwtToken = new JWTToken(); // Assuming JWTToken has a method generateAccessToken

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies.userJWT;
        if (!accessToken) {
            return res.status(401).json({ message: "Access Denied: No access token provided." });
        }

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
            req.userId = decoded.userId;

            const user = await userRepo.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            if (user.is_blocked) {
                return res.status(401).json({ message: 'You are blocked by admin!' });
            }
            if (!user.is_approved) {
                return res.status(401).json({ message: 'Account is not approved' });
            }

            next();
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    return res.status(401).json({ message: "Access Denied: No refresh token provided." });
                }

                try {
                    const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload;
                    const user = await userRepo.findById(decodedRefresh.userId);
                    if (!user || user.refreshToken !== refreshToken) {
                        return res.status(401).json({ message: 'Not authorized, invalid refresh token' });
                    }
                    const newAccessToken = jwtToken.generateAccessToken(decodedRefresh.userId, 'user');
                    res.cookie('userJWT', newAccessToken, {
                        httpOnly: true,
                        sameSite: 'none',
                        secure: process.env.NODE_ENV !== 'development',
                        maxAge: 30 * 24 * 60 * 60 * 1000 
                    });

                    req.userId = decodedRefresh.userId;
                    next();
                } catch (refreshErr) {
                    return res.status(401).json({ message: 'Not authorized, invalid refresh token' });
                }
            } else {
                return res.status(401).json({ message: 'Not authorized, invalid access token' });
            }
        }
    } catch (error) {
        console.error('Error in protect middleware:', error);
        return res.status(401).json({ message: 'Not authorized, an error occurred' });
    }
};
