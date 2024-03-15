import { Request,Response } from "express";
import adminUsercases from "../use_case/adminUsecases";


class AdminController{
    private adminUsecase: adminUsercases;


    constructor(adminUsecase:adminUsercases){
        this.adminUsecase = adminUsecase;
    }

    async login(req: Request, res: Response) {
        try {
            const adminData = await this.adminUsecase.login(req.body);
            if (adminData) {
                res.cookie('adminJWT', adminData.data.token, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: process.env.NODE_ENV !== 'development',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                });
                res.status(adminData?.status).json(adminData.data);
            }
        } catch (err) {
            console.log(err);
            res.status(401).json(err);
        }
    }

    async logout(req: Request, res: Response) {
        try {
            res.cookie("adminJWT","", {
                httpOnly: true,
                expires: new Date(0),
            });
            res.status(200).json("Logged Out Successfully");
        } catch (error) {
            console.log(error)
        }
    }

    async allUsers(req: Request, res: Response) {
        try {
            const users = await this.adminUsecase.findUsers();
            if (users) {
                const { status, data } = users;
                return res.status(status).json(data);
            } else {
                return res.status(500).json("Internal Server Error");
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json("Internal Server Error");
        }
    }

    async blockUser(req:Request,res:Response){
        try {
            const user = await this.adminUsecase.blockUser(req?.params.id)
            return res.status(user.status).json(user.data)
        } catch (error) {
            console.log(error)
        }
    }

    async approveUser(req: Request, res: Response) {
        try {
            console.log(req?.params.id,"id")
            const Data = await this.adminUsecase.approveUser(req?.params.id)
            return res.status(200).json(Data?.data)
        } catch (error) {
            console.log(error)
            return res.status(500).json("Internal server Error")
        }
    }

    async allListings(req: Request, res: Response) {
        try {
            const Data = await this.adminUsecase.findListings();
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

    async approveListing(req:Request,res:Response){
        try {
            console.log("yup")
            const Data=await this.adminUsecase.approveListing(req?.params.id)
            return res.status(200).json(Data?.data)
        } catch (error) {
            console.log(error)
            return res.status(500).json("Internal server Error")
        }
    }

    async blocListing(req: Request, res: Response) {
        try {
            const user = await this.adminUsecase.blockListing(req?.params.id)
            return res.status(user.status).json(user.data)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Internal server Error')
        }
    }

}
export default AdminController