import Booking from "../../domain/booking";
import BookingsModal from "../database/bookingModel";
import IBookingRepo from "../../use_case/interface/bookingRepoInterface";
import mongoose from "mongoose";

class BookingRepository implements IBookingRepo {
    async addnewBooking (data:any){
        const newBooking = new BookingsModal(data)
        const bookingOut = await newBooking.save()
        return bookingOut
        
    }

    async getBookings(id: string) {
        try {
            const bookings = await BookingsModal.find({ userId: id, status: { $in: ['confirmed', 'pending'] }, isCancelled: { $ne: true },cancelReq:{$ne:true}})
                .populate({
                    path: 'roomId',
                    select: 'name images'
                }).exec();
            return bookings;
        } catch (error) {
            console.log(error);
        }
    }


    async canceledBookings(id: string) {
        try {
            const bookings = await BookingsModal.find({
                userId: id, $or: [
                    { status: 'cancelled' },
                    { cancelReq: true }
                ]}).populate({
                path: 'roomId',
                select: 'name images'
            }).exec();
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
                    queryCondition['status']='completed'
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
            console.log(queryCondition, 'sts')
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

    async hostupdateBookingStatus(bookingId: string, refundId: string, pass: string) {
        try {
            let updateOperation;
            if (pass === "full") {
                updateOperation = {
                    $set: {
                        refundId: refundId,
                        status: "cancelled",
                        isCancelled: true,
                        serviceFee: 0
                    }
                };
            } else {
                updateOperation = {
                    $set: {
                        refundId: refundId,
                        status: "cancelled",
                        isCancelled: true
                    }
                };
            }

            const result = await BookingsModal.updateOne({ _id: bookingId }, updateOperation);
            return result;
        } catch (error) {
            console.error("Error updating booking status:", error);
            throw new Error("Database error");
        }
    }


    async createdTime(Id: string, bookingId: string) {
        try {
            const booking = await BookingsModal.findOne({ _id: bookingId, userId: Id }).select('createdAt')
            return booking;
        } catch (error) {
            console.error("Error fetching booking by ID:", error);
            throw new Error("Database error");
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

    async BookingById(bookingId: string) {
        try {
            const booking = await BookingsModal.findOne({ _id: bookingId});
            return booking;
        } catch (error) {
            console.error("Error fetching booking by ID:", error);
            throw new Error("Database error");
        }
    }

    async checkBookingById(Id: string) {
        try {
            const booking = await BookingsModal.findOne({ _id:Id})
            return booking;
        } catch (error) {
            console.error("Error fetching booking by ID:", error);
            throw new Error("Database error");
        }
    }

    async updateBookingStatus(bookingId:string,refundType:string) {
        try {
            const result = await BookingsModal.updateOne(
                { _id: bookingId },
                { $set: {refundType: refundType, cancelReq: true} }
            );
            return result;
        } catch (error) {
            console.error("Error updating booking status:", error);
            throw new Error("Database error");
        }
    }

    async hostConfirmBooking(bookingId:string) {
        try {
            const result = await BookingsModal.updateOne(
                { _id: bookingId },
                { $set: {status:"confirmed"}}
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

    async bookingAndreview(roomId: string,Id:string) {
        try {
            const bookings = await BookingsModal.find({ userId: Id, roomId: roomId, status: 'completed', isCancelled: { $ne: true } })
            return bookings
        } catch (error) {
            console.log(error)
        }
    }

    async hostReviewcheck(hostId: string, Id: string) {
        try {
            const bookings = await BookingsModal.find({ userId: Id, hostId: hostId, status: 'completed', isCancelled: { $ne: true } })
            return bookings
        } catch (error) {
            console.log(error)
        }
    }

    async dashboard(id: string) {
        try {
            const now = new Date();
            const matchHostId = { $match: { hostId: new mongoose.Types.ObjectId(id) } };

            const monthlyRevenueAndBookingsAggregation = [
                matchHostId,
                { $match: { status: "completed" } },
                {
                    $group: {
                        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                        monthlyRevenue: { $sum: "$totalAmount" },
                        totalBookings: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ];

            const totalEarningsAggregation = [
                matchHostId,
                { $group: { _id: null, totalEarnings: { $sum: "$totalAmount" } } },
            ];

            const totalBookingsAggregation = [
                matchHostId,
                { $group: { _id: null, totalBookings: { $sum: 1 } } },
            ];

            const upcomingReservationsAggregation = [
                matchHostId,
                { $match: { status: { $in: ["pending", "confirmed"] }, checkOutDate: { $gte: now } } },
                { $group: { _id: null, totalUpcomingReservations: { $sum: 1 } } },
            ];

            const [
                monthlyRevenueResult,
                totalEarningsResult,
                totalBookingsResult,
                upcomingReservationsResult
            ] = await Promise.all([
                BookingsModal.aggregate(monthlyRevenueAndBookingsAggregation as any[]),
                BookingsModal.aggregate(totalEarningsAggregation as any[]),
                BookingsModal.aggregate(totalBookingsAggregation as any[]),
                BookingsModal.aggregate(upcomingReservationsAggregation as any[]),
            ]);

            const monthlyRevenue = monthlyRevenueResult.map(item => ({
                year: item._id.year,
                month: item._id.month,
                monthlyRevenue: item.monthlyRevenue,
                totalBookings: item.totalBookings,
            }));

            const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].totalEarnings : 0;
            const totalBookings = totalBookingsResult.length > 0 ? totalBookingsResult[0].totalBookings : 0;
            const totalUpcomingReservations = upcomingReservationsResult.length > 0 ? upcomingReservationsResult[0].totalUpcomingReservations : 0;

            return { monthlyRevenue, totalEarnings, totalBookings, totalUpcomingReservations };
        } catch (error) {
            console.error("Error in dashboard function:", error);
            throw error;
        }
    }

    // admin dashboard
    async adminDashboard() {
        try {
            const now = new Date();
            const monthlyRevenueAndBookingsAggregation = [
                { $match: { status: "completed" } },
                {
                    $group: {
                        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                        monthlyRevenue: { $sum: "$serviceFee" },
                        totalBookings: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ];

            const totalEarningsAggregation = [
                { $group: { _id: null, totalEarnings: { $sum: "$serviceFee" } } },
            ];

            const totalBookingsAggregation = [
                { $group: { _id: null, totalBookings: { $sum: 1 } } },
            ];

            const upcomingReservationsAggregation = [
                { $match: { status: { $in: ["pending", "confirmed"] }, checkOutDate: { $gte: now } } },
                { $group: { _id: null, totalUpcomingReservations: { $sum: 1 } } },
            ];

            const [
                monthlyRevenueResult,
                totalEarningsResult,
                totalBookingsResult,
                upcomingReservationsResult
            ] = await Promise.all([
                BookingsModal.aggregate(monthlyRevenueAndBookingsAggregation as any[]),
                BookingsModal.aggregate(totalEarningsAggregation as any[]),
                BookingsModal.aggregate(totalBookingsAggregation as any[]),
                BookingsModal.aggregate(upcomingReservationsAggregation as any[]),
            ]);

            const monthlyRevenue = monthlyRevenueResult.map(item => ({
                year: item._id.year,
                month: item._id.month,
                monthlyRevenue: item.monthlyRevenue,
                totalBookings: item.totalBookings,
            }));

            const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].totalEarnings : 0;
            const totalBookings = totalBookingsResult.length > 0 ? totalBookingsResult[0].totalBookings : 0;
            const totalUpcomingReservations = upcomingReservationsResult.length > 0 ? upcomingReservationsResult[0].totalUpcomingReservations : 0;

            return { monthlyRevenue, totalEarnings, totalBookings, totalUpcomingReservations };
        } catch (error) {
            console.error("Error in dashboard function:", error);
            throw error;
        }
    }

}
export default BookingRepository