import { Request, Response } from "express";
import reviewUsercase from "../use_case/reviewUsecases";
import jwt, { JwtPayload } from "jsonwebtoken";


class reviewController {
    private reviewUsercase: reviewUsercase;

    constructor(reviewUsercase: reviewUsercase){
        this.reviewUsercase = reviewUsercase
    }

    async addReview(req: Request, res: Response) {
        try {
            const roomId = req.params.id;
            const token = req.cookies.userJWT
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
            const Id = decoded.userId
            req.body.roomId= roomId
            req.body.userId=Id
            const data= await this.reviewUsercase.addReview(req.body)
            if(data){
                res.status(data.status).json(data?.data)
            }else{
                return res.status(500).json({ message: "Failed to add review." });
            }
        } catch (error) {
            console.log(error)
        }
    }


    async roomReviewEdit(req: Request, res: Response) {
        try {
            const roomId = req.params.id;
            const token = req.cookies.userJWT
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
            const Id = decoded.userId
            req.body.roomId= roomId
            req.body.userId=Id
            const data = await this.reviewUsercase.roomReviewEdit(req.body)
            if(data){
                res.status(data.status).json(data?.data)
            }else{
                return res.status(500).json({ message: "Failed to add review." });
            }
        } catch (error) {
            console.log(error)
        }
    }

    async getRoomReviews(req: Request, res: Response) {
        try {
            const roomId = req.params.id
            const data = await this.reviewUsercase.getRoomReviews(roomId)
            if (data){
                return res.status(data.status).json(data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async bookingAndreview(req: Request, res: Response) {
        try {
            const roomId = req.query.roomId;
            const token = req.cookies.userJWT
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
            const Id = decoded.userId
            if (typeof roomId === 'string'){
                const data = await this.reviewUsercase.bookingAndreview(roomId,Id)
                if (data) {
                    return res.status(data.status).json(data.data)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default reviewController