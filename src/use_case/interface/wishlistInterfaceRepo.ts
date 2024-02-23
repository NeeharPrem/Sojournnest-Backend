export default interface IWishlist{
    addTowishlist(roomId:string,Id:string):Promise<any>
    checkExisist(roomId:string,Id:string):Promise<any>
    removeWishlist(roomId:string,Id:string):Promise<any>
}