import mongoose, { Schema, Document, ObjectId } from 'mongoose';

interface IHostReview extends Document {
    userId: ObjectId;
    hostId: ObjectId;
    rating: number,
    experience: string
}

const HostReviewSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    hostId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Rooms' },
    rating: { type: Number, required: true },
    experience: { type: String, required: true }
}, { timestamps: true });

const HostReview = mongoose.model<IHostReview>('HostReview', HostReviewSchema);

export default HostReview;