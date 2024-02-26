import Booking from "../../domain/booking";
import BookingsModal from "../database/bookingModel";
import IBookingRepo from "../../use_case/interface/bookingRepoInterface";
import mongoose from "mongoose";

class BookingRepository implements IBookingRepo {
    async addnewBooking (data:Booking){
        console.log(data)
        
    }

    async getBookingdate(id:string){
        try {
            const Data = await BookingsModal.find({
                roomId: id,
                isCancelled: false,
                bookingStatus: true,
                status: { $in: ['confirmed', 'pending'] },
            }, 'checkInDate checkOutDate -_id').exec();

            const bookedDates = Data.map(booking => ({
                checkInDate: booking.checkInDate,
                checkOutDate: booking.checkOutDate,
            }));

            return bookedDates
        } catch (error) {
            console.log(error)
        }
    }

    async checkDateAvailability(roomId:string, checkInISO:string, checkOutISO:string){
        try {
            console.log(roomId,checkInISO,checkOutISO,"reii")
            
            const overlappingBookings = await BookingsModal.find({
                roomId: roomId,
                $and: [
                    { checkInDate: { $lt: checkOutISO } },
                    { checkOutDate: { $gt: checkInISO} }
                ]
            })

            if (overlappingBookings.length === 0) {
                console.log("The selected date range is available for booking.");
                return {
                    isAvailable: true,
                    message: "The selected date range is available for booking.",
                    overlappingBookings: []
                };
            } else {
                console.log("The selected date range is not available for booking.");
                return {
                    isAvailable: false,
                    message: "The selected date range is not available for booking.",
                    overlappingBookings: overlappingBookings
                };
            }
        } catch (error) {
            console.log(error)
        }
    }
}
export default BookingRepository