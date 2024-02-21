import { Request, Response } from "express";
import BookingUsecase from "../use_case/bookingUsecase";

class BookingController{
    private BookingUsecase:BookingUsecase;

    constructor(BookingUsecase:BookingUsecase){
        this.BookingUsecase=BookingUsecase
    }

    async newBooking(req:Request,res:Response){
        try {
            console.log(req.body)
        } catch (error) {
            console.log(error)
        }
    }
}

export default BookingController