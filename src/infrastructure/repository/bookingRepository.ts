import Booking from "../../domain/booking";
import BookingsModal from "../database/bookingModel";
import IBookingRepo from "../../use_case/interface/bookingRepoInterface";

class BookingRepository implements IBookingRepo {
    async addnewBooking (data:any){
        const newBooking = new BookingsModal(data)
        const bookingOut = await newBooking.save()
        return bookingOut
        
    }

    async getBookings(id: string) {
        try {
            const bookings = await BookingsModal.find({ userId: id, status: { $in: ['confirmed', 'pending'] }, isCancelled: { $ne: true } }).populate('roomId')
            return bookings
        } catch (error) {
            console.log(error)
        }
    }

    async getBookingById(Id:string,bookingId:string) {
        try {
            console.log(Id,bookingId,"byId")
            const booking = await BookingsModal.findOne({
                where: {_id: bookingId, userId: Id }
            });
            console.log(booking,"id bok")
            return booking;
        } catch (error) {
            console.error("Error fetching booking by ID:", error);
            throw new Error("Database error");
        }
    }

    async updateBookingStatus(bookingId:string,newstatus:string) {
        try {
            console.log("upone")
            const result = await BookingsModal.updateOne({ status: newstatus,isCancelled: true},{ where: { id: bookingId } }
            );
            return result;
        } catch (error) {
            console.error("Error updating booking status:", error);
            throw new Error("Database error");
        }
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