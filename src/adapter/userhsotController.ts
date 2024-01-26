import { Request, Response } from "express";
import UserHostUsecase from "../use_case/userhostUsecase";
import jwt, { JwtPayload } from "jsonwebtoken";

class UserHostController {
    private userhostUsecase: UserHostUsecase;

    constructor(userhostUsecase: UserHostUsecase) {
        this.userhostUsecase = userhostUsecase;
    }

    async addRoom(req: Request, res: Response) {
        try {
            const token=req.cookies.userJWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
            const Id=decoded.userId

            const { latitude, longitude, state, district, category, name, bedrooms, bathrooms, guests, subdescription, description, rent, amenities}=req.body
            if (!latitude || !longitude || !state || !district || !category || !name || !bedrooms || !bathrooms || !guests || !subdescription || !description || !rent) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const images = req.files
            const roomData={
                userId:Id,
                latitude,
                longitude,
                state,
                district,
                category,
                name,
                bedrooms,
                bathrooms,
                amenities,
                guests,
                subdescription,
                description,
                rent,
                images,
                is_blocked:false,
            }
            const roomAdded= await this.userhostUsecase.addRoom(roomData)
            if(roomAdded){
                res.status(200).json(roomAdded)
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default UserHostController;
