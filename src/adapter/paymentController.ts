import { Request, Response } from "express";
import paymentUsecase from "../use_case/paymentUsecase";

class paymentController {
    private paymentUsecase: paymentUsecase

    constructor(paymentUsecase: paymentUsecase){
        this.paymentUsecase = paymentUsecase
    }

    async addServiceFee(req: Request, res: Response) {
        try {
            console.log(req.body)
            const data = await this.paymentUsecase.addServiceFee(req.body)
            if (data) {
                res.status(data.status).json(data?.data)
            } else {
                return res.status(500).json({ message: "Failed" });
            }
        } catch (error) {
            console.log(error)
        }
    }
}
export default paymentController