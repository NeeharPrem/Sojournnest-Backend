import Room from "../../domain/room";
import { RoomsModel } from "../database/roomsModel";
import HostRepo from "../../use_case/interface/hostRepo";

class HostRepository implements HostRepo {
    async addnewRoom(roomData: Room) {
        const newRoomData = new RoomsModel(roomData)
        const restaurantRequest = await newRoomData.save()
        return restaurantRequest
    }
}

export default HostRepository;