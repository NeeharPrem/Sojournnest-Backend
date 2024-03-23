import IReviewRepo from "./interface/reviewRepoInterface"
import IBookingRepo from "./interface/bookingRepoInterface";
import IHostReview from "./interface/hostReviewInterface";

interface ReviewData {
    userId: string; 
    roomId: string; 
    rating:number;
    experience:string
}

interface HostReviewData {
    userId: string;
    hostId: string;
    rating: number;
    experience: string
}

class reviewUsercase {
    private IReviewRepo: IReviewRepo
    private IBookingRepo: IBookingRepo
    private IHostReview: IHostReview

    constructor(IReviewRepo: IReviewRepo, IBookingRepo: IBookingRepo, IHostReview: IHostReview) {
        this.IReviewRepo = IReviewRepo
        this.IBookingRepo = IBookingRepo
        this.IHostReview = IHostReview
    }

    async addReview(data: ReviewData) {
        try {
            const newData= {
                userId:data.userId,
                roomId:data.roomId,
                rating:data.rating,
                experience:data.experience
            }
         const rating= await this.IReviewRepo.addRating(newData)
         if(rating){
            return{
                status:200,
                data:{
                data:rating,
                message:'Review added'
                }
            }
         }else{
            return{
                status:400,
                data:{
                    message:'Failed to add review'
                }
            }
         }
        } catch (error) {
            console.log(error)
        }
    }

    async roomReviewEdit(data: ReviewData) {
        try {
            const newData = {
                userId: data.userId,
                roomId: data.roomId,
                rating: data.rating,
                experience: data.experience
            }
            const rating = await this.IReviewRepo.roomReviewEdit(newData)
            if (rating) {
                return {
                    status: 200,
                    data: {
                        data: rating,
                        message: 'Review updated'
                    }
                }
            } else {
                return {
                    status: 400,
                    data: {
                        message: 'Failed to update review'
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async getRoomReviews(roomId:string){
        try {
            const getData = await this.IReviewRepo.getRoomReviews(roomId)
            if (getData.length > 0) {
                return {
                    status: 200,
                    data: {
                        data: getData
                    }
                }
            } else {
                return {
                    status: 400,
                    data: {
                        message: 'Failed to load Review'
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async bookingAndreview(roomId: string,Id:string) {
       try {
           const completedBooking = await this.IBookingRepo.bookingAndreview(roomId, Id)
           if (completedBooking.length==0) {
               return {status:200,data:{
                   success: false, reason: 'nobooking'
               }};
           }
           const completedReview = await this.IReviewRepo.bookingAndreview(roomId,Id)
           if (completedReview.length===0){
               return { status: 200,data:{
                   success: false, reason: 'noreview'
               }}
           }
           return { status: 200,data:{
            data:completedReview, success: true,reason: 'addreview'
           }}
       } catch (error) {
           console.log(error)
           return { status: 500,data:{
               success: false, reason: 'error'
           }}
       }
    }

    // host review
    async hostReviewcheck(hostId: string, Id: string) {
        try {
            console.log(hostId,Id,'ddd')
            const completedBooking = await this.IBookingRepo.hostReviewcheck(hostId, Id)
            if (completedBooking.length == 0) {
                return {
                    status: 200, data: {
                        success: false, reason: 'nobooking'
                    }
                };
            }
            const completedReview = await this.IHostReview.bookingAndreview(hostId, Id)
            if (completedReview.length === 0) {
                return {
                    status: 200, data: {
                        success: false, reason: 'noreview'
                    }
                }
            }
            return {
                status: 200, data: {
                    data: completedReview, success: true, reason: 'addreview'
                }
            }
        } catch (error) {
            console.log(error)
            return {
                status: 500, data: {
                    success: false, reason: 'error'
                }
            }
        }
    }

    async postHostreview(data: HostReviewData) {
        try {
            const newData = {
                userId: data.userId,
                hostId: data.hostId,
                rating: data.rating,
                experience: data.experience
            }
            const rating = await this.IHostReview.addRating(newData)
            if (rating) {
                return {
                    status: 200,
                    data: {
                        data: rating,
                        message: 'Review added'
                    }
                }
            } else {
                return {
                    status: 400,
                    data: {
                        message: 'Failed to add review'
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async HostReviewEdit(data: HostReviewData) {
        try {
            const newData = {
                userId: data.userId,
                hostId: data.hostId,
                rating: data.rating,
                experience: data.experience
            }
            const rating = await this.IHostReview.roomReviewEdit(newData)
            if (rating) {
                return {
                    status: 200,
                    data: {
                        data: rating,
                        message: 'Review updated'
                    }
                }
            } else {
                return {
                    status: 400,
                    data: {
                        message: 'Failed to update review'
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async getHostReviews(hostId: string) {
        try {
            const getData = await this.IHostReview.getHostReviews(hostId)
            if (getData.length > 0) {
                return {
                    status: 200,
                    data: {
                        data: getData
                    }
                }
            } else {
                return {
                    status: 400,
                    data: {
                        message: 'Failed to load Review'
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default reviewUsercase