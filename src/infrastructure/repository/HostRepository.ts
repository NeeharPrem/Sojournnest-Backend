import Room from "../../domain/room";
import { RoomsModel } from "../database/roomsModel";
import IHostRepo from "../../use_case/interface/hostRepo";

class HostRepository implements IHostRepo {
    async addnewRoom(roomData: Room) {
        const newRoomData = new RoomsModel(roomData)
        const restaurantRequest = await newRoomData.save()
        return restaurantRequest
    }

    async findById(_id: any){
        const Data = await RoomsModel.findById({ _id });
        return Data;
    }

    async getListings(id: any) {
        const Data = await RoomsModel.find({userId:id});
        return Data;
    }

    async findListings(page: number = 1, pageSize: number = 10): Promise<any> {
        try {
            const listData = await RoomsModel.find({})
                .populate('userId')
                .limit(pageSize)
                .skip((page - 1) * pageSize);
            return listData;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async findOneAndUpdate(_id: string, update: Partial<Room>): Promise<Room | null> {
        const user = await RoomsModel.findOneAndUpdate(
            { _id },
            { $set: update },
            { new: true }
        );
        return user;
    }
}

export default HostRepository;