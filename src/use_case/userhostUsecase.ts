import Room from "../domain/room"
import HostRepository from "../infrastructure/repository/HostRepository"
import CloudinarySetup from "../infrastructure/utils/cloudinarySetup"


class UserHostUsecase {
    private hostRepository:HostRepository
    private CloudinarySetup: CloudinarySetup

    constructor(
        hostRepository: HostRepository,
        CloudinarySetup: CloudinarySetup
    ){
        ;this.hostRepository = hostRepository;
        this.CloudinarySetup = CloudinarySetup;
    }

    async addRoom(roomData:Room){
        try {
            const uploadImages = await Promise.all(
                roomData.images.map(async (file: any) => {
                    const result = await this.CloudinarySetup.upload(file.path, "Hosted-places");
                    return result?.secure_url;
                })
            );
            console.log(uploadImages)
            roomData.images=uploadImages
            const roomStatus= await this.hostRepository.addnewRoom(roomData)
            if(roomStatus){
                return{
                    status:200,
                    data:roomStatus
                }
            }
        } catch (error) {
            return {
                status: 400,
                data: { message: 'Failed to add Room' },
            };
        }
    }
}

export default UserHostUsecase