import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IBooking extends Document {
  userId: ObjectId;
  roomId: ObjectId;
  hostId: ObjectId;
  bookingStatus: boolean;
  paymentMode: string;
  checkInDate: Date;
  checkOutDate: Date;
  isCancelled: boolean;
  totalAmount: number;
  status: string;
}

const BookingSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  roomId: { type: Schema.Types.ObjectId, required: true, index: true },
  hostId: { type: Schema.Types.ObjectId, required: true },
  bookingStatus: { type: Boolean, default: true },
  paymentMode: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  isCancelled: { type: Boolean, default: false },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

BookingSchema.index({ roomId: 1, checkInDate: 1, checkOutDate: 1 }, { unique: true });

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;
