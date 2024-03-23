import Review from "../../domain/review";

export default interface IReview {
    addRating(data:Review): Promise<any>
    roomReviewEdit(data:Review):Promise<any>
    getRoomReviews(roomId:string):Promise<any>
    bookingAndreview(roomId:string,Id:string):Promise<any>
}