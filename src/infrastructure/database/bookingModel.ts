import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IBooking extends Document {
  userId: ObjectId;
  roomId: ObjectId;
  hostId: ObjectId;
  bookingStatus: boolean;
  paymentMode: string;
  checkInDate: Date;
  checkOutDate: Date;
  cancelReq:boolean;
  isCancelled: boolean;
  totalAmount: number;
  status: string;
  cancelledRole:string;
  chargeId:string;
  refundId?:string;
  serviceFee:number
  refundType?:string;
}

const BookingSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, index: true,ref:'User'},
  roomId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Rooms'},
  hostId: { type: Schema.Types.ObjectId, required: true,index:true,ref:'User'},
  bookingStatus: { type: Boolean, default: true },
  paymentMode: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  cancelReq:{type:Boolean,default:false},
  cancelledRole:{type:String},
  isCancelled: { type: Boolean, default: false },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  chargeId:{type:String},
  refundId: { type: String, default: ''},
  serviceFee:{type:Number},
  refundType:{type:String}
}, { timestamps: true });

BookingSchema.index({ roomId: 1, checkInDate: 1, checkOutDate: 1 }, { unique: true });

const BookingModal = mongoose.model<IBooking>('Booking', BookingSchema);
export default BookingModal;