import {Request,Response} from 'express'
import WishlistUsecase from '../use_case/wishlistUsecase'
import jwt,{JwtPayload } from 'jsonwebtoken'


class WishlistController{
    private WishlistUsecase: WishlistUsecase

    constructor(WishlistUsecase:WishlistUsecase){
        this.WishlistUsecase = WishlistUsecase
    }

    async addTowishlist(req:Request,res:Response){
       try {
        const roomId = req.params.id
        const token= req.cookies.userJWT
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload
        const Id= decode.userId
        const Data = await this.WishlistUsecase.addTowishlist(roomId,Id)
        if(Data){
            return res.status(Data.status).json(Data.message)
        }
       } catch (error) {
        console.log(error)
       }
    }

    async checkExisist(req:Request,res:Response){
        try {
            const roomId= req.params.id
            const token = req.cookies.userJWT
            const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload
            const Id = decode.userId
            const Data = await this.WishlistUsecase.checkExisist(roomId,Id)
            return res.status(200).json(Data)
        } catch (error) {
            console.log(error)
        }
    }

    async userWishlists(req: Request, res: Response) {
        try {
            const token = req.cookies.userJWT
            const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload
            const Id = decode.userId
            const Data = await this.WishlistUsecase.userWishlists(Id)
            console.log(Data,'userwish')
            return res.status(200).json(Data)
        } catch (error) {
            console.log(error)
        }
    }

    async removeWishlist(req:Request,res:Response){
        try{
            const roomId=req.params.id
            const token=req.cookies.userJWT
            const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload
            const Id = decode.userId
            const Data = await this.WishlistUsecase.removeWishlist(roomId,Id)
            if(Data){
                console.log(Data)
                 return res.status(Data?.status ?? 200).json(Data)
            }
        }catch(error){
            console.log(error)
        }
    }
}

export default WishlistController