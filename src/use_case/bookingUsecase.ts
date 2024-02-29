import IBookingRepo from "./interface/bookingRepoInterface";
import PaymentRepository from "../infrastructure/repository/paymentRepository";
import Booking from "../domain/booking";

class BookingUsecase{
    private IBooking:IBookingRepo
    private PaymentRepo: PaymentRepository
    constructor(
        IBooking:IBookingRepo,
        PaymentRepo: PaymentRepository
    ){
        this.IBooking= IBooking;
        this.PaymentRepo = PaymentRepo
    }

    async addBooking(Data:Booking,userId:string){
        try {
            const checkInDateISO = new Date(Data.checkInDate).toISOString();
            const checkOutDateISO = new Date(Data.checkOutDate).toISOString();
            const booking={
                userId:userId,
                roomId:Data.roomId,
                hostId:Data.hostId,
                bookingStatus:true,
                paymentMode:'Card',
                checkInDate: checkInDateISO,
                checkOutDate: checkOutDateISO,
                isCancelled:false,
                totalAmount: Data?.totalAmount,
                status:'Pending'
            }
            const saveData= await this.IBooking.addnewBooking(booking)
            return saveData
        } catch (error) {
            console.log(error)
            return {
                status: 400,
                data: { message: 'Booking Failed' },
            };
        }
    }

    async Payment(data: any) {
        const payment = await this.PaymentRepo.ConfirmPayment(data)
        if (payment) {
            return {
                status: 200,
                data: payment
            }
        }
    }

    async PaymentConfirm(data: any) {
        const paymentSuccess = await this.PaymentRepo.PaymentSuccess(data)
        if (!paymentSuccess) {
            console.log("fail");
            return null
        } else {
            return true
        }
    }

    async getBookings(id: string) {
        try {
            const Data = await this.IBooking.getBookings(id)
            if (Data.length>0) {
                console.log(Data)
                return {
                    status: 200,
                    data: Data
                }
            } else {
                return {
                    status: 400,
                    data: {
                        message: "No Bookings"
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async cancelBooking(Id: string,bookingId: string) {
        try {
            console.log('useca')
            const booking = await this.IBooking.getBookingById(Id,bookingId);
            if (!booking) {
                return {
                    status: 404,
                    data: { message: "Booking not found or does not belong to the user" },
                };
            }
            if (booking.status === 'Canceled') {
                return {
                    status: 400,
                    data: { message: "Booking is already canceled" },
                };
            }
            const newstatus= 'canceled'
            await this.IBooking.updateBookingStatus(bookingId, newstatus);
            return {
                status: 200,
                data: { message: "Booking canceled successfully" },
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500,
                data: { message: "An error occurred while canceling the booking" },
            };
        }
    }


    async getBookingdate(id:string) {
        try {
            const Data = await this.IBooking.getBookingdate(id)
            if(Data){
                console.log(Data)
                return{
                    status:200,
                    data:Data
                }
            }else{
                return{
                    status:400,
                    data:{
                        message:"No Booking Data"
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async checkDateAvailability(roomId: string, checkInISO: string, checkOutISO:string){
        try {
            const Data = await this.IBooking.checkDateAvailability(roomId, checkInISO, checkOutISO)
            if (Data.isAvailable){
               return {
                status:200,
                data:{
                    message: Data.message
                }
               }
            }else{
                return{
                    status:400,
                    data:{
                        message:Data.message,
                        data: Data.overlappingBookings
                    }
                }
            }
        } catch (error) {
            console.log(error)
            return {
                status:500,
                data:{
                    message: "Something went wrong"
                }
            }
        }
    }
}

export default BookingUsecase