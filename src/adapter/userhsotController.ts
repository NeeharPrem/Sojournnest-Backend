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

            const {latitude,longitude,state,district,category,name,bedrooms,bathrooms,guests,subdescription,description, rent, amenities}=req.body
            if (!latitude || !longitude || !state || !district || !category || !name || !bedrooms || !bathrooms || !guests || !subdescription || !description || !rent) {
                return res.status(400).json('Missing required fields');
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
                is_approved:false,
                is_listed:true
            }
            const roomAdded= await this.userhostUsecase.addRoom(roomData)
            if(roomAdded){
                res.status(200).json(roomAdded)
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getListings (req:Request,res:Response){
        try {
            const token = req.cookies.userJWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
            const Id = decoded.userId
            const Data=await this.userhostUsecase.getListings(Id)
            if(Data){
                return res.status(Data.status).json(Data.data)
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json("Internal Server Error")
        }
    }

    async unlist(req: Request, res: Response) {
        try {
            const Id = req.params.id
            const Data = await this.userhostUsecase.unlist(Id)
            if (Data) {
                return res.status(Data.status).json(Data.data)
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json("Internal Server Error")
        }
    }

    async roomData(req: Request, res: Response) {
        try {
            const Id = req.params.id
            const Data = await this.userhostUsecase.roomData(Id)
            console.log(Data)
            if (Data) {
                return res.status(Data.status).json(Data)
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json("Internal Server Error")
        }
    }

    async roomDataUpdate(req: Request, res: Response) {
        try {
            const Id = req.params.id
            const images = req.files
            console.log(images)
            const { name,
                bedrooms,
                bathrooms,
                guests,
                rent,
                subdescription,
                description,
                latitude,
                longitude,
                amenities,
                state,
                district,
                category,
                }=req.body
            const roomData = {
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
            }
            const Data = await this.userhostUsecase.roomDataUpdate(Id,roomData)
            console.log(Data)
            if (Data) {
                return res.status(Data.status).json(Data)
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json("Internal Server Error")
        }
    }

    async allListings(req: Request, res: Response) {
        try {
            const Data = await this.userhostUsecase.findListings();
            if (Data) {
                const { status, data } = Data;
                return res.status(status).json(data);
            } else {
                return res.status(500).json("Internal Server Error");
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json("Internal Server Error");
        }
    }
}

export default UserHostController;
