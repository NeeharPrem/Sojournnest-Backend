import Room from "../../domain/room";
import { RoomsModel } from "../database/roomsModel";
import IHostRepo from "../../use_case/interface/hostRepo";

interface BlockDateData {
    name:string
    startDate: Date;
    endDate: Date;
}

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
            const totalCount = await RoomsModel.countDocuments({
                is_blocked: false,
                is_listed: true,
                is_approved: true
            });

            const listData = await RoomsModel.find({
                is_blocked: false,
                is_listed: true,
                is_approved: true
            })
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

    async findAllListings(page: number, limit: number = 8): Promise<any> {
        try {
            const listData = await RoomsModel.find({})
                .populate('userId')
                .limit(limit)
                .skip((page - 1) * limit);
            const total = await RoomsModel.countDocuments();
            return { data: listData, total };
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

    async blockDate(roomId: string, data: BlockDateData) {
        try {
            const existingBlock = await RoomsModel.findOne({
                _id: roomId,
                blockedDates: {
                    $elemMatch: {
                        name: data.name,
                        startDate: data.startDate,
                        endDate: data.endDate
                    }
                }
            });
            if (existingBlock) {
                console.log('Blocked date with provided details already exists.');
                return {error: 'Blocked dates already exists.'};
            }
            const updatedRoom = await RoomsModel.findOneAndUpdate(
                { _id: roomId },
                { $push: { blockedDates: { startDate: data.startDate, endDate: data.endDate, name: data.name } } },
                { new: true }
            );

            return updatedRoom;
        } catch (error) {
            console.error('Error blocking date:', error);
            throw error;
        }
    }

    async blockedDates(id: string) {
        const roomData = await RoomsModel.findById({ _id: id }).select('blockedDates');
        if (roomData && roomData.blockedDates) {
            console.log(roomData,'da')
            return roomData.blockedDates;
        } else {
            return [];
        }
    }

    async removeDate(roomId: string, data: { index: number }) {
        try {
            const room = await RoomsModel.findById(roomId);
            if (room && data.index >= 0 && data.index < room.blockedDates.length) {
                room.blockedDates.splice(data.index, 1);
                const updatedRoom = await room.save();
                console.log('Blocked date removed successfully.');
                return updatedRoom;
            } else {
                console.log('No room found, or invalid index.');
                return { error: 'No room found, or invalid index.' };
            }
        } catch (error) {
            console.error('Error unblocking date:', error);
            throw error;
        }
    }

}

export default HostRepository;