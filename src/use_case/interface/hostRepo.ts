import Room from "../../domain/room";

interface HostRepo{
    addnewRoom(roomData:Room): Promise<any>;
}

export default HostRepo;