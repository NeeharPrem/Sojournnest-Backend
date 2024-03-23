import IPaymentset from "./interface/paymentRepoInterface";

interface RawData {
    serviceFee: number;
    reason: string;
    status:boolean
}

class paymentUsecase{
    private IPaymentset: IPaymentset

    constructor(IPaymentset: IPaymentset){
        this.IPaymentset=IPaymentset
    }

    async addServiceFee(data: RawData) {
        try {
            const newData = {
                serviceFee: data.serviceFee,
                reason: data.reason,
                status:true
            }
            const rating = await this.IPaymentset.addServiceFee(newData)
            if (rating) {
                return {
                    status: 200,
                    data: {
                        data: rating,
                        message: 'Service Fee Updated'
                    }
                }
            } else {
                return {
                    status: 400,
                    data: {
                        message: 'Failed to update'
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async LatestFee(){
        try {
            const data = this.IPaymentset.LatestFee()
            return data
        } catch (error) {
            console.log(error)
        }
    }
}
export default paymentUsecase