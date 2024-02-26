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

    async getBookingdate(req: Request, res: Response) {
        try {
            const roomId= req.params.id
            const Data = await this.BookingUsecase.getBookingdate(roomId)
            return res.status(Data?.status || 400).json(Data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    async checkDateAvailability(req: Request, res: Response) {
        try {
            const { roomId, checkInDate, checkOutDate } = req.body;

            const convertDate = (dateString: string) => {
                const [day, month, year] = dateString.split('/');
                return new Date(Date.UTC(+year, +month - 1, +day));
            };
            const checkInISO = convertDate(checkInDate).toISOString();
            const checkOutISO = convertDate(checkOutDate).toISOString();
            const Data = await this.BookingUsecase.checkDateAvailability(roomId, checkInISO, checkOutISO);
            if(Data){
                return res.status(Data.status).json(Data?.data)
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'An error occurred while checking date availability.' });
        }
    }

}

export default BookingController