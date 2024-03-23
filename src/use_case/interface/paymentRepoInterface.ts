import Paymentsetting from "../../domain/paymentsetting";

export default interface IPaymentset{
    addServiceFee(data: Paymentsetting):Promise<any>
    LatestFee():Promise<any>
}