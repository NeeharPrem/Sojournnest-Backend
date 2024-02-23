import Wishlist from "../database/wishlistModel";
import IWishlist from "../../use_case/interface/wishlistInterfaceRepo";
import mongoose from "mongoose";

class wishlistRepository implements IWishlist{
    async addTowishlist(roomId: string, userId: string) {
    try {
        const roomIdObjectId = new mongoose.Types.ObjectId(roomId);
        let wishlist = await Wishlist.findOne({ userId: userId });

        if (wishlist) {
            const result = await Wishlist.updateOne(
                { userId: userId },
                { $addToSet: { roomId: roomIdObjectId } }
            );
            if (result.modifiedCount === 0) {
                return {
                    status: false,
                    message: "Room already exists in wishlist."
                };
            } else {
                const updatedWishlist = await Wishlist.findOne({ userId: userId });
                return {
                    status:true,
                    data: updatedWishlist
                }
            }
        } else {
            const newWishlist = new Wishlist({
                userId: userId,
                roomId: [roomIdObjectId],
            });
            await newWishlist.save();
            return{
            status:true,
                data: newWishlist
        }
      }
    } catch (error) {
        console.log(error);
        throw new Error('Failed to add to wishlist');
    }
}

async checkExisist(roomId:string,userId:string){
    try {
        const roomIdObjectId = new mongoose.Types.ObjectId(roomId);
        let wishlist = await Wishlist.findOne({ userId: userId });
        if (wishlist) {
            const exists = wishlist.roomId.some(id => id.equals(roomIdObjectId));
            return exists;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error)
        throw new Error('Something went wrong')
    }
}

   async removeWishlist(roomId: string, userId: string) {
    try {
        const roomIdObjectId = new mongoose.Types.ObjectId(roomId);
        let wishlist = await Wishlist.findOne({ userId: userId });
        if (wishlist) {
            const exists = wishlist.roomId.some(id => id.equals(roomIdObjectId));
            if (exists) {
                await Wishlist.updateOne(
                    { userId: userId },
                    { $pull: { roomId: roomIdObjectId } }
                );
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        throw new Error('Something went wrong');
    }
}


}

export default wishlistRepository;