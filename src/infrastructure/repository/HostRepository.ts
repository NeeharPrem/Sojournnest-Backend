import Room from "../../domain/room";
import { RoomsModel } from "../database/roomsModel";
import IHostRepo from "../../use_case/interface/hostRepo";

class HostRepository implements IHostRepo {
    async addnewRoom(roomData: Room) {
        const newRoomData = new RoomsModel(roomData)
        const roomsData = await newRoomData.save()
        return roomsData
    }

    async findById(_id: any){
        const Data = await RoomsModel.findById({ _id }).populate('userId');
        return Data;
    }

    async getListings(id: any) {
        const Data = await RoomsModel.find({userId:id});
        return Data;
    }

    async findAll(query: any, sortOptions: any) {
        const defaultConfig = {
            is_approved: true,
            is_blocked: false,
            is_listed: true,
        };
        const finalQuery = { ...defaultConfig, ...query };

        const data = await RoomsModel.find(finalQuery).sort(sortOptions).exec();

        return data;
    }

    async findListings(page: number, pageSize: number = 8): Promise<any> {
        try {
            const totalCount = await RoomsModel.countDocuments();
            const listData = await RoomsModel.find({})
                .populate('userId')
                .limit(pageSize)
                .skip((page - 1) * pageSize);
            const hasMore = page * pageSize < totalCount;
            return { data: listData, hasMore };
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