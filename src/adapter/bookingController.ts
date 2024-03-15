import { Request, Response } from "express";
import BookingUsecase from "../use_case/bookingUsecase";
import jwt, { JwtPayload } from 'jsonwebtoken'


const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    throw new Error("Stripe secret key is not defined");
}

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

    async payment(req: Request, res: Response) {
        try {
            req.app.locals.bookings = req.body;
            const token = req.cookies.userJWT
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
            const Id = decoded.userId
            req.app.locals.userId=Id
            const payment = await this.BookingUsecase.Payment(req.body);
            res.status(200).json(payment?.data);
        } catch (error) {
           console.log(error)
        }
    }

    async webhook(request: Request, response: Response) {
        try {
            const localData = request.app.locals.bookings;
            const userId = request.app.locals.userId;
            const Payment = await this.BookingUsecase.PaymentConfirm(request);
            if (Payment) {
                const booking = await this.BookingUsecase.addBooking(localData, userId)
                response.status(200).json(booking?.data);
            } else {
                response.status(400).json("Booking failed")
            }
        } catch (error) {
            console.log(error)
        }
    }


    async getBookings(req: Request, res: Response) {
        try {
            const token = req.cookies.userJWT
            const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload
            const Id = decode.userId
            const Data = await this.BookingUsecase.getBookings(Id)
            return res.status(Data?.status || 400).json(Data?.data)
        } catch (error) {
            console.log(error)
        }
    }


    async canceledBookings(req: Request, res: Response) {
        try {
            const token = req.cookies.userJWT
            const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload
            const Id = decode.userId
            const Data = await this.BookingUsecase.canceledBookings(Id)
            return res.status(Data?.status || 400).json(Data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    async upBookings(req: Request, res: Response) {
        try {
            const token = req.cookies.userJWT;
            const status = req.query.status;
            const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
            const Id = decode.userId;

            if (status === undefined || typeof status === 'string') {
                const Data = await this.BookingUsecase.upBookings(Id, status || 'upcoming');
                return res.status(Data?.status || 400).json(Data?.data);
            } else {
                return res.status(400).json({ error: 'Invalid status parameter' });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async hostCancelBookings(req: Request, res: Response) {
        try {
            const bookingId= req.params.id
            const Data = await this.BookingUsecase.hostCancelBookings(bookingId)
            return res.status(Data?.status || 400).json(Data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    async cancelBooking(req: Request, res: Response) {
        try {
            const bookingId= req.params.id
            const token = req.cookies.userJWT
            const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload
            const Id = decode.userId
            const Data = await this.BookingUsecase.cancelBooking(Id,bookingId)
            return res.status(Data?.status || 400).json(Data?.data)
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