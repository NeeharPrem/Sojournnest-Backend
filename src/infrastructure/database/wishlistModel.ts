import mongoose, { Schema, Document, ObjectId } from 'mongoose';

interface IWishlist extends Document {
  _id: ObjectId;
  userId: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId[];
}

const WishlistSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  roomId: [{ 
    type: Schema.Types.ObjectId,
     required:true,
    ref:'Rooms'
  }],
});

const Wishlist = mongoose.model<IWishlist>('Wishlist', WishlistSchema);

export default Wishlist;