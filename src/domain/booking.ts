import { ObjectId } from "mongoose";

interface Booking{
    totalAmount: number;
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
    guests:number
}

export default Booking