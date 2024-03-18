import Booking from "../../domain/booking"

interface IBookingRepo{
    addnewBooking(Data: any):Promise<any>
    allbookings(page:number,limit:number):Promise<any>;
    getBookings(Id:string):Promise<any>
    canceledBookings(Id: string): Promise<any>
    upBookings(Id: string,status:string): Promise<any>
    hostCancelBookings(id:string):Promise<any>
    getBookingById(Id:string,bookingId:string):Promise<any>
    updateBookingStatus(bookingId: string, newstatus:string):Promise<any>
    getBookingdate(id:string):Promise<any>
    checkDateAvailability(roomId: string, checkInISO: string, checkOutISO:string):Promise<any>
}

export default IBookingRepo