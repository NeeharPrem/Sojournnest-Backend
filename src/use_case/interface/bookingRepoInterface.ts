import Booking from "../../domain/booking"

interface IBookingRepo{
    addnewBooking(Data: any):Promise<any>
    allbookings(page:number,limit:number):Promise<any>;
    getBookings(Id:string):Promise<any>
    canceledBookings(Id: string): Promise<any>
    upBookings(Id: string,status:string): Promise<any>
    hostCancelBookings(id:string):Promise<any>
    hostupdateBookingStatus(id: string,refundId:string):Promise<any>
    createdTime(id:string,roomId:string):Promise<any>
    getBookingById(Id:string,bookingId:string):Promise<any>
    checkBookingById(Id: string): Promise<any>
    updateBookingStatus(bookingId: string,refundType:string):Promise<any>
    getBookingdate(id:string):Promise<any>
    checkDateAvailability(roomId: string, checkInISO: string, checkOutISO:string):Promise<any>
    bookingAndreview(roomId:string,Id:string):Promise<any>
    hostReviewcheck(hostId:string,Id:string):Promise<any>
    dashboard(id:string):Promise<any>
    adminDashboard():Promise<any>
}

export default IBookingRepo