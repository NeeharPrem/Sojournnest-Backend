import IBookingRepo from "./interface/bookingRepoInterface";
import PaymentRepository from "../infrastructure/repository/paymentRepository";
import Booking from "../domain/booking";
import IPaymentset from "./interface/paymentRepoInterface";

class BookingUsecase{
    private IBooking:IBookingRepo
    private PaymentRepo: PaymentRepository
    private IPaymentset: IPaymentset
    constructor(
        IBooking:IBookingRepo,
        PaymentRepo: PaymentRepository,
        IPaymentset: IPaymentset
    ){
        this.IBooking= IBooking;
        this.PaymentRepo = PaymentRepo
        this.IPaymentset = IPaymentset
    }

    async addBooking(Data: Booking, userId: string, chargeId:string) {
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
            const setOut = await this.IPaymentset.LatestFee();
            let serviceFeePercentage = setOut.serviceFee
            const defaultServiceFeePercentage = 10;
            serviceFeePercentage = (typeof serviceFeePercentage === 'number' && !isNaN(serviceFeePercentage)) ? serviceFeePercentage : defaultServiceFeePercentage;

            let newTotal = Data?.totalAmount
            if (isNaN(newTotal)) {
                console.error('Rent conversion error, received:', Data?.totalAmount);
            }

            const serviceFeeCalculated = !isNaN(serviceFeePercentage) ? (newTotal * serviceFeePercentage / 100) : newTotal;
            if (isNaN(serviceFeeCalculated)) {
                console.error('Calculated rent resulted in NaN. Rent:', serviceFeeCalculated, 'Service Fee Percentage:', serviceFeePercentage);
            }
             
            
            const checkInDateISO = convertToISO(Data.checkInDate);
            const checkOutDateISO = convertToISO(Data.checkOutDate);

            const booking = {
                userId: userId,
                roomId: Data.roomId,
                hostId: Data.hostId,
                bookingStatus: true,
                paymentMode: 'Card',
                guests:Data.guests,
                checkInDate: checkInDateISO,
                checkOutDate: checkOutDateISO,
                isCancelled: false,
                totalAmount: Data?.totalAmount,
                status: 'pending',
                chargeId: chargeId,
                serviceFee: serviceFeeCalculated
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
            return null
        } else {
            return true
        }
    }

    async getBookings(id: string) {
        try {
            const Data = await this.IBooking.getBookings(id)
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
            const Data = await this.IBooking.checkBookingById(id);
            if (Data) {
                let RefundCents=0;
                let pass=''
                if (Data.cancelReq === true) {
                    if (Data.refundType === 'full') {
                        RefundCents = (Data.totalAmount) * 100;
                        pass="full"
                    } else if (Data.refundType === 'partial') {
                        RefundCents = (Data.totalAmount-Data.serviceFee) * 100;
                        pass="partial"
                    }
                } else {
                    RefundCents = (Data.totalAmount) * 100;
                    pass='full'
                }
                RefundCents = Math.round(RefundCents);
                const refundOut = await this.PaymentRepo.createRefund(Data.chargeId, RefundCents);
                const RefundData = await this.IBooking.hostupdateBookingStatus(id, refundOut?.id ?? '',pass);
                if (RefundData) {
                    return { status: 200, data: Data };
                } else {
                    return { status: 400, data: { message: "No Bookings" } };
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async cancelBooking(Id: string,bookingId: string) {
        try {
            const datDate = await this.IBooking.createdTime(Id, bookingId)
            const output = checkTimeDifferenceAndConvertTo12Hr(datDate.createdAt)

            function checkTimeDifferenceAndConvertTo12Hr(timestamp:any) {
                const date = new Date(timestamp);
                const currentDate = new Date();
                const diffHours = Math.abs(date.getTime() - currentDate.getTime()) / 36e5;
                const isGreaterThan48Hours = diffHours > 48;
                let hours = date.getHours();
                const minutes = date.getMinutes();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
                const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                return isGreaterThan48Hours
            }
             
            const booking = await this.IBooking.getBookingById(Id,bookingId);
            if (!booking) {
                return {
                    status: 404,
                    data: { message: "Booking not found or does not belong to the user" },
                };
            }
            if(output){
                const refundType='partial'
                await this.IBooking.updateBookingStatus(bookingId,refundType);
            }else{
                const refundType = 'full'
                await this.IBooking.updateBookingStatus(bookingId,refundType);
            }
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

    async hostConfirmBooking(bookingId: string) {
        try {
            const booking = await this.IBooking.BookingById(bookingId);
            if (!booking) {
                return {
                    status: 404,
                    data: { message: "Booking not found or does not belong to the user" },
                };
            }

            if (booking.status === "confirmed") {
                return {
                    status: 200,
                    data: { message: "Booking is already confirmed" },
                };
            }

            const updatedBooking = await this.IBooking.hostConfirmBooking(bookingId);

            if (!updatedBooking) {
                return {
                    status: 400,
                    data: { message: "Unable to confirm booking at this time" },
                };
            }

            return {
                status: 200,
                data: { message: "Booking confirmed" },
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500,
                data: { message: "An error occurred while confirming the booking" },
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

    // host dashboard
    async dashboard(id:string) {
        try {
            const Data = await this.IBooking.dashboard(id)
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

    // admin dashboard
    async adminDashboard() {
        try {
            const Data = await this.IBooking.adminDashboard()
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
}

export default BookingUsecase