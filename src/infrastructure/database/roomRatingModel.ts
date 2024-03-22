import mongoose, { Schema, Document, ObjectId } from 'mongoose';

interface IRoomReview extends Document {
        userId: ObjectId;
        roomId: ObjectId;
        rating: number,
        experience:string
}

const ReviewSchema: Schema = new Schema({
        userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
        roomId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Rooms' },
        rating:{type:Number,required:true},
        experience:{type:String,required:true}
    }, { timestamps: true });

const RoomReview = mongoose.model<IRoomReview>('RoomReview', ReviewSchema);

export default RoomReview;