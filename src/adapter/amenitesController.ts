import { Request, Response } from "express";
import AmenitiesUsecase from "../use_case/amenitiesUsecase";


class AmenityController{
    private AmenitiesUsecase:AmenitiesUsecase;

    constructor(AmenitiesUsecase:AmenitiesUsecase){
        this.AmenitiesUsecase = AmenitiesUsecase
    }

    async newEntry(req:Request,res:Response) {
        try {
            const amenity=req.body.amenities
            const data= amenity.toLowerCase()
            const outData = await this.AmenitiesUsecase.newEntry(data)
            if (outData) {
                return res.status(outData.status).json(outData.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async findAmenity(req: Request, res: Response) {
        try {
            const Data = await this.AmenitiesUsecase.findAmenity()
            if (Data) {
                return res.status(Data.status).json(Data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteEntry(req: Request, res: Response) {
        try {
            const data = req.body.amenities
            const id=req.body.id
            const Data = await this.AmenitiesUsecase.deleteEntry(data,id)
            console.log(Data,"1")
            if (Data) {
                return res.status(Data.status).json(Data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default AmenityController