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
        let token = req.cookies.adminJWT;
    if(token){
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
            if(decode){
                if(!decode.role || decode.role !== 'admin'){
                    return res.status(401).json({message:"Not atherized, invalid token"})
                }
                next()
            }else{
                return res.status(401).json({message:"Not autherized, invalid token"})
            }
        } catch (error) {
            return res.status(401).json({message:"Not autherized, invalide token"})
        }
    }else{
        return res.status(401).json("Not autherized, invalide token")
    }
};