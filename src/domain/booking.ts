import { ObjectId } from "mongoose";

interface Booking{
    totalAmount: string;
    _id?: string;
    roomId:ObjectId;
    userId:ObjectId;
    hostId:ObjectId;
    isCancelled:boolean;
    paymentMode:string;
    bookingStatus:boolean;
    status:string;
    checkInDate:string;
    checkOutDate:string;
}

export default Booking