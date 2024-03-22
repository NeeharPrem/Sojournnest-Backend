import { Request, Response } from "express";
import UserHostUsecase from "../use_case/userhostUsecase";
import jwt, { JwtPayload } from "jsonwebtoken";
import ChatUseCase from "../use_case/chatUseCase";
import paymentUsecase from "../use_case/paymentUsecase";

class UserHostController {
    private userhostUsecase: UserHostUsecase;
    private chatuseCase: ChatUseCase;
    private paymentUsecase: paymentUsecase;

    constructor(userhostUsecase: UserHostUsecase, chatuseCase: ChatUseCase, paymentUsecase: paymentUsecase) {
        this.userhostUsecase = userhostUsecase;
        this.chatuseCase = chatuseCase
        this.paymentUsecase = paymentUsecase
    }

    async addRoom(req: Request, res: Response) {
        try {
            const token=req.cookies.userJWT
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
            const Id=decoded.userId

            const setOut = await this.paymentUsecase.LatestFee();
            let serviceFeePercentage = setOut.serviceFee
            const defaultServiceFeePercentage = 10;
            serviceFeePercentage = (typeof serviceFeePercentage === 'number' && !isNaN(serviceFeePercentage)) ? serviceFeePercentage : defaultServiceFeePercentage;

            const { latitude, longitude, state, district, category, name, bedrooms, bathrooms, guests, subdescription, description, rent: rentStr, amenities}=req.body
            if (!latitude || !longitude || !state || !district || !category || !name || !bedrooms || !bathrooms || !guests || !subdescription || !description || !rentStr || !serviceFeePercentage) {
                return res.status(400).json('Missing required fields');
            }

            let rent = parseFloat(rentStr);
            if (isNaN(rent)) {
                console.error('Rent conversion error, received:', rentStr);
                return res.status(400).json('Invalid rent value');
            }

            const calculatedRent = !isNaN(serviceFeePercentage) ? rent + (rent * serviceFeePercentage / 100) : rent;
            if (isNaN(calculatedRent)) {
                console.error('Calculated rent resulted in NaN. Rent:', rent, 'Service Fee Percentage:', serviceFeePercentage);
                return res.status(500).json('Error calculating rent with service fee');
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
                rent: calculatedRent,
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
            console.log('ww')
            const token = req.cookies.userJWT
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
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
            console.log(Id)
            const Data = await this.userhostUsecase.roomData(Id)
            if (Data) {
                return res.status(Data.status).json(Data)
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json("Internal Server Error")
        }
    }

    async roomDetail(req: Request, res: Response) {
        try {
            const Id = req.params.id
            console.log(Id)
            const Data = await this.userhostUsecase.roomData(Id)
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
            const page = req.query.page;
            const pageNumber = parseInt(page as string, 10) || 1;
            const Data = await this.userhostUsecase.findListings(pageNumber);

            if (Data) {
                return res.status(Data.status).json(Data.data);
            } else {
                return res.status(500).json("Internal Server Error");
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json("Internal Server Error");
        }
    }


    async newConversation(req: Request, res: Response) {
        try {
            const senderId = req.body.senderId
            const members = [
                { memberId: req.body.senderId },
                { memberId: req.body.receiverId }
            ];
            const existing = await this.chatuseCase.checkExisting(members,senderId)
            if (!existing?.length) {
                console.log("entered");
                
                const conversation = await this.chatuseCase.newConversation(members, senderId)
                res.status(conversation?.status).json(conversation?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async getConversations(req: Request, res: Response) {
        try {
            console.log(req.params.id);
            const conversations = await this.chatuseCase.getConversations(req.params.id)
            res.status(conversations.status).json(conversations.data)
        } catch (error) {
           console.log(error)
        }
    }

    async addMessage(req: Request, res: Response) {
        try {
            const data = {
                ...req.body,
            };
            const message = await this.chatuseCase.addMessage(data)
            res.status(message.status).json(message.data)
        } catch (error) {
            console.log(error)
        }
    }

    async getMessages(req: Request, res: Response) {
        try {
            const messages = await this.chatuseCase.getMessages(req.params.id)
            res.status(messages.status).json(messages.data)
        } catch (error) {
            console.log(error)
        }
    }

    async blockDate(req: Request, res: Response) {
        try {
            const roomId = req.params.id
            const data= req.body
            const blocked = await this.userhostUsecase.blockDate(roomId,data)
            res.status(blocked.status).json(blocked.data)
        } catch (error) {
            console.log(error)
        }
    }

    async blockedDates(req: Request, res: Response) {
        try {
            const roomId = req.params.id
            const blocked = await this.userhostUsecase.blockedDates(roomId)
            res.status(blocked.status).json(blocked.data)
        } catch (error) {
            console.log(error)
        }
    }

    async removeDate(req: Request, res: Response) {
        try {
            const roomId = req.params.id
            const data = req.body
            const unblocked = await this.userhostUsecase.removeDate(roomId, data)
            res.status(unblocked.status).json(unblocked.data)
        } catch (error) {
            console.log(error)
        }
    }

}

export default UserHostController;
