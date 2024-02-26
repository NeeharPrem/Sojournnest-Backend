import Booking from "../../domain/booking"

interface IBookingRepo{
    addnewBooking(Data: Booking):Promise<any>
    getBookingdate(id:string):Promise<any>
    checkDateAvailability(roomId: string, checkInISO: string, checkOutISO:string):Promise<any>
}

export default IBookingRepo