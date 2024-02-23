import IWishlist from "./interface/wishlistInterfaceRepo";

class WishlistUsecase{
    private IWishlist:IWishlist

    constructor(IWishlist:IWishlist){
        this.IWishlist=IWishlist
    }

    async addTowishlist(roomId:string,Id:string){
        try{
           const Data= await this.IWishlist.addTowishlist(roomId,Id)
          if(Data){
            if(Data.status==true){
                return{
                    status:200,
                    message:"Added to wishlist"
                }
            }else{
                return{
                    status:400,
                    message:"Room already exisist"
                }
            }
          }else{
            return{
                status:400,
                message:"Failed to add wishlist"
            }
          }
        }catch(error){
            console.log(error)
        }
    }

    async checkExisist(roomId:string,Id:string){
        try {
            const Data = await this.IWishlist.checkExisist(roomId, Id)
            return Data
        } catch (error) {
            console.log(error)
        }
    }

    async removeWishlist(roomId:string,Id:string){
        try {
            const Data = await this.IWishlist.removeWishlist(roomId,Id)
            if(Data){
                return {
                    status:200,
                    message:'Removes from wislist'
                }
            }else{
                return {
                    status:400,
                    message:'Failed to remove'
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default WishlistUsecase