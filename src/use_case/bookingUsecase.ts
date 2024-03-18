import IBookingRepo from "./interface/bookingRepoInterface";
import PaymentRepository from "../infrastructure/repository/paymentRepository";
import Booking from "../domain/booking";

class BookingUsecase{
    private IBooking:IBookingRepo
    private PaymentRepo: PaymentRepository
    constructor(
        IBooking:IBookingRepo,
        PaymentRepo: PaymentRepository
    ){
        this.IBooking= IBooking;
        this.PaymentRepo = PaymentRepo
    }

    async addBooking(Data: Booking, userId: string) {
        const convertToISO = (dateString: string) => {
            const parts = dateString.split('/');
            const day = parts[0];
            const month = parts[1];
            const year = parts[2];
            const date = new Date(`${year}-${month}-${day}`);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }
            return date.toISOString();
        };

        try {
            console.log(Data.checkInDate, '', Data.checkOutDate);
            const checkInDateISO = convertToISO(Data.checkInDate);
            const checkOutDateISO = convertToISO(Data.checkOutDate);

            const booking = {
                userId: userId,
                roomId: Data.roomId,
                hostId: Data.hostId,
                bookingStatus: true,
                paymentMode: 'Card',
                checkInDate: checkInDateISO,
                checkOutDate: checkOutDateISO,
                isCancelled: false,
                totalAmount: Data?.totalAmount,
                status: 'pending'
            };

            const saveData = await this.IBooking.addnewBooking(booking);
            return saveData;
        } catch (error) {
            console.log(error);
            return {
                status: 400,
                data: { message: 'Booking Failed' },
            };
        }
    }

    async Payment(data: any) {
        const payment = await this.PaymentRepo.ConfirmPayment(data)
        if (payment) {
            return {
                status: 200,
                data: payment
            }
        }
    }

    async PaymentConfirm(data: any) {
        const paymentSuccess = await this.PaymentRepo.PaymentSuccess(data)
        if (!paymentSuccess) {
            console.log("fail");
            return null
        } else {
            return true
        }
    }

    async getBookings(id: string) {
        try {
            const Data = await this.IBooking.getBookings(id)
            console.log(Data)
            if (Data.length>0) {
                return {
                    status: 200,
                    data: Data
                }
            } else {
                return {
                    status: 400,
                    data: {
                        message: "No Bookings"
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }


    async canceledBookings(id: string) {
        try {
            const Data = await this.IBooking.canceledBookings(id)
            if (Data.length > 0) {
                return {
                    status: 200,
                    data: Data
                }
            } else {
                return {
                    status: 400,
                    data: {
                        message: "No Bookings"
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async upBookings(id: string,status:string) {
    try {
        const Data = await this.IBooking.upBookings(id,status)
        console.log(Data,'upb')
        if (Data) {
            return {
                status: 200,
                data: Data
            };
        } else {
            return {
                status: 200,
                data: {
                    message: "No bookings available.",
                    isEmpty: true
                }
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            data: {
                message: "An error occurred while fetching bookings."
            }
        };
    }
}


    async hostCancelBookings(id: string) {
        try {
            const Data = await this.IBooking.hostCancelBookings(id)
            if (Data) {
                return {
                    status: 200,
                    data: Data
                }
            } else {
                return {
                    status: 400,
                    data: {
                        message: "No Bookings"
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async cancelBooking(Id: string,bookingId: string) {
        try {
            console.log('useca')
            const booking = await this.IBooking.getBookingById(Id,bookingId);
            if (!booking) {
                return {
                    status: 404,
                    data: { message: "Booking not found or does not belong to the user" },
                };
            }
            const newstatus= 'cancelled'
            await this.IBooking.updateBookingStatus(bookingId, newstatus);
            return {
                status: 200,
                data: { message: "Booking canceled successfully" },
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500,
                data: { message: "An error occurred while canceling the booking" },
            };
        }
    }


    async getBookingdate(id:string) {
        try {
            const Data = await this.IBooking.getBookingdate(id)
            if(Data){
                console.log(Data)
                return{
                    status:200,
                    data:Data
                }
            }else{
                return{
                    status:400,
                    data:{
                        message:"No Booking Data"
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async checkDateAvailability(roomId: string, checkInISO: string, checkOutISO:string){
        try {
            const Data = await this.IBooking.checkDateAvailability(roomId, checkInISO, checkOutISO)
            if (Data.isAvailable){
               return {
                status:200,
                data:{
                    message: Data.message
                }
               }
            }else{
                return{
                    status:400,
                    data:{
                        message:Data.message,
                        data: Data.overlappingBookings
                    }
                }
            }
        } catch (error) {
            console.log(error)
            return {
                status:500,
                data:{
                    message: "Something went wrong"
                }
            }
        }
    }

    // all bookings for admin
    async allbookings(page:number,limit:number) {
        try {
            const Data = await this.IBooking.allbookings(page,limit)
            if (Data.data.length > 0) {
                return {
                    status: 200,
                    data: Data
                }
            } else {
                return {
                    status: 400,
                    data: {
                        message: "No Bookings"
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default BookingUsecase