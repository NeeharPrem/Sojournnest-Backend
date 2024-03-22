import IHostReview from "../../use_case/interface/hostReviewInterface";
import HostReview from "../database/hostRatingModel";

interface RoomReviewEditData {
    hostId: string;
    userId: string;
    rating: number;
    experience: string
}

class hostreviewRepository implements IHostReview {
    async addRating(data: object) {
        const newRating = new HostReview(data);
        await newRating.save();
        return newRating;
    }

    async roomReviewEdit(data: RoomReviewEditData) {
        console.log('here')
        const { hostId, userId, ...updateData } = data;

        const updatedRating = await HostReview.updateOne(
            { hostId: hostId, userId: userId },
            { $set: updateData },
            { upsert: true }
        );
        console.log(updatedRating, 'upd')
        return updatedRating;
    }


    async getHostReviews(hostId: string) {
        try {
            const Data = await HostReview.find({ hostId: hostId }).populate('userId')
            if (Data) {
                return Data
            } else {
                return []
            }
        } catch (error) {
            console.log(error)
        }
    }

    async bookingAndreview(hostId: string, Id: string) {
        try {
            const Data = await HostReview.findOne({ hostId: hostId, userId: Id })
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
export default hostreviewRepository;