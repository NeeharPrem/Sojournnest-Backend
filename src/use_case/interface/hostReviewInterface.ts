import HostReview from "../../domain/HostReview"

export default interface IHostReview {
    addRating(data: HostReview): Promise<any>
    roomReviewEdit(data: HostReview): Promise<any>
    getHostReviews(roomId: string): Promise<any>
    bookingAndreview(hostId: string, Id: string): Promise<any>
}