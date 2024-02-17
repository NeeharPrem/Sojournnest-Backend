import Room from "../../domain/room";

interface IHostRepo{
    addnewRoom(roomData:Room): Promise<any>;
    findAll(query: any, sortOptions:string):Promise<any>;
    findListings():Promise<any>;
    findById(_id: string): Promise<Room | null>;
    getListings(_id: string): Promise<Room[]>;
    findOneAndUpdate(query: any, update: any, options?: any): Promise<Room | null>; 
}

export default IHostRepo;