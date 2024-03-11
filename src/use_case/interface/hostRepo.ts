import Room from "../../domain/room";

interface IHostRepo{
    addnewRoom(roomData:Room): Promise<any>;
    findAll(query: any, sortOptions:string):Promise<any>;
    findListings(page:number):Promise<any>;
    findById(_id: string): Promise<Room | null>;
    getListings(_id: string): Promise<Room[]>;
    findOneAndUpdate(query: any, update: any, options?: any): Promise<Room | null>;
    blockDate(roomId:string,data:object):Promise<any>
    blockedDates(roomId:string):Promise<any>;
    removeDate(roomId:string,data:object):Promise<any>;
}

export default IHostRepo;