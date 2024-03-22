import IPaymentset from "../../use_case/interface/paymentRepoInterface";
import PaymentSetting from "../database/paymentModel";

class paymensettingRepository implements IPaymentset{
    async addServiceFee (data:object){
        const result = await PaymentSetting.findOne().sort({ createdAt: -1 });

    if (result) {
        await PaymentSetting.updateOne({ _id: result._id }, { $set: { status: false } });
    }
    const newFee = new PaymentSetting(data);
    await newFee.save();

    return newFee;
    }

    async LatestFee(){
        const result = await PaymentSetting.findOne({ status: true }, { serviceFee: 1, _id: 0 });
        return result
    }
}
export default paymensettingRepository