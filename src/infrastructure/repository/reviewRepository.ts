import IReview from "../../use_case/interface/reviewRepoInterface";
import RoomReview from "../database/roomRatingModel";

interface RoomReviewEditData {
    roomId: string;
    userId: string;
    rating:number;
    experience:string
}

class reviewRepository implements IReview {
    async addRating(data:object) {
        const newRating = new RoomReview(data);
        await newRating.save();
        return newRating;
    }

    async roomReviewEdit(data: RoomReviewEditData) {
        console.log('here')
        const { roomId, userId, ...updateData } = data;

        const updatedRating = await RoomReview.updateOne(
            { roomId: roomId, userId: userId },
            { $set: updateData },
            { upsert: true } 
        );
        console.log(updatedRating,'upd')
        return updatedRating;
    }


    async getRoomReviews(roomId:string){
        try {
            const Data = await RoomReview.find({ roomId: roomId }).populate('userId')
            if (Data) {
                return Data
            } else {
                return []
            }
        } catch (error) {
            console.log(error)
        }
    }

    async bookingAndreview(roomId: string,Id:string) {
        try {
            const Data = await RoomReview.findOne({ roomId: roomId,userId:Id})
            if (Data) {
                return Data
            } else {
                return []
            }
        } catch (error) {
            console.log(error)
        }
    }

}
export default reviewRepository;