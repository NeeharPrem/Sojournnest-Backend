import Booking from "../../domain/booking"

interface IBookingRepo{
    addnewBooking(Data: any):Promise<any>
    getBookings(Id:string):Promise<any>
    getBookingById(Id:string,bookingId:string):Promise<any>
    updateBookingStatus(bookingId: string, newstatus:string):Promise<any>
    getBookingdate(id:string):Promise<any>
    checkDateAvailability(roomId: string, checkInISO: string, checkOutISO:string):Promise<any>
}

export default IBookingRepo