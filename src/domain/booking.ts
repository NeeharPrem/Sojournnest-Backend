import { ObjectId } from "mongoose";

interface Booking{
    _id?: string;
    roomId:ObjectId;
    userId:ObjectId;
    hostId:ObjectId;
    totalamount:number;
    isCancelled:boolean;
    paymentMode:string;
    bookingStatus:boolean;
    status:string;
    checkInDate:Date;
    checkOutDate:Date;
}

export default Booking