import IBookingRepo from "./interface/bookingRepoInterface";
import Booking from "../domain/booking";

class BookingUsecase{
    private IBooking:IBookingRepo

    constructor(
        IBooking:IBookingRepo
    ){
        this.IBooking= IBooking
    }

    async addBooking(Data:Booking){
        try {
            console.log(Data)
        } catch (error) {
            console.log(error)
            return {
                status: 400,
                data: { message: 'Booking Failed' },
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