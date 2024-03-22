import mongoose, { Schema, Document} from 'mongoose';

interface IPayment extends Document {
    serviceFee: number;
    reason: string;
    status:boolean
}

const PaymentSchema: Schema = new Schema({
    serviceFee: { type: Number, required: true },
    reason: { type: String, required: true },
    status:{type:Boolean,default:true}
}, { timestamps: true });

const PaymentSetting = mongoose.model<IPayment>('PaymentSetting', PaymentSchema);

export default PaymentSetting;