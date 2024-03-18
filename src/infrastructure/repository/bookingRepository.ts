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
            const bookings = await BookingsModal.find({ userId: id, status: { $in: ['confirmed', 'Pending'] }, isCancelled: { $ne: true } }).populate('roomId')
            return bookings
        } catch (error) {
            console.log(error)
        }
    }

    async canceledBookings(id: string) {
        try {
            const bookings = await BookingsModal.find({ userId: id, status: { $in: ['cancelled'] }}).populate('roomId')
            return bookings
        } catch (error) {
            console.log(error)
        }
    }

    async upBookings(Id: string, status?: string, page: number = 1, limit: number = 10) {
        try {
            let queryCondition: Record<string, any> = { hostId: Id };
            switch (status) {
                case 'completed':
                    queryCondition['checkoutDate'] = { $lt: new Date().toISOString() };
                    break;
                case 'upcoming':
                    queryCondition['status'] = { $in: ['pending', 'confirmed'] };
                    break;
                case 'cancelled':
                    queryCondition['status'] = 'cancelled';
                    break;
                case 'all':
                    break;
                default:
                    queryCondition['status'] = status;
            }
            const skip = (page - 1) * limit;
            const bookings = await BookingsModal.find(queryCondition)
                .populate([{ path: 'userId' }, { path: 'roomId' }])
                .limit(limit)
                .skip(skip);
            const totalDocuments = await BookingsModal.countDocuments(queryCondition);
            const totalPages = Math.ceil(totalDocuments / limit);
            return {
                data: bookings,
                pagination: {
                    totalDocuments,
                    totalPages,
                    currentPage: page,
                    limit
                }
            };
        } catch (error) {
            console.log(error);
            return { data: [], pagination: {} };
        }
    }

    async hostCancelBookings(id: string) {
    try {
        const booking = await BookingsModal.findById(id);
        if (!booking) {
            console.log("Booking not found");
            return;
        }
        booking.cancelledRole = booking.cancelReq ? 'User' : 'Host';
        booking.status = 'cancelled';
        booking.isCancelled= true;
        const updatedBooking = await booking.save();
        return updatedBooking;
    } catch (error) {
        console.log(error);
    }
}

    async getBookingById(Id:string,bookingId:string) {
        try {
            const booking = await BookingsModal.findOne({ _id: bookingId, userId:Id });
            return booking;
        } catch (error) {
            console.error("Error fetching booking by ID:", error);
            throw new Error("Database error");
        }
    }

    async updateBookingStatus(bookingId:string,newstatus:string) {
        try {
            const result = await BookingsModal.updateOne(
                { _id: bookingId },
                { $set: { status: newstatus, isCancelled: true } }
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

    async allbookings(page = 1, limit = 10): Promise<any> {
    try {
        const bookings = await BookingsModal.find({})
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({ path: 'userId', select: 'fname lname' })
            .populate({ path: 'hostId', select: 'fname lname' })
            .populate({ path: 'roomId', select: 'name' });

            const total = await BookingsModal.countDocuments();
            return { data: bookings, total };
    } catch (error) {
        console.log(error);
        return { data: [], total: 0 };
    }
}

}
export default BookingRepository