import Room from "../domain/room"
import HostRepository from "../infrastructure/repository/HostRepository"
import CloudinarySetup from "../infrastructure/utils/cloudinarySetup"
import IHostRepo from "./interface/hostRepo"


class UserHostUsecase {
    private IHostRepo: IHostRepo
    private CloudinarySetup: CloudinarySetup

    constructor(
        IHostRepo: IHostRepo,
        CloudinarySetup: CloudinarySetup
    ){
        ; this.IHostRepo = IHostRepo;
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
            const roomStatus = await this.IHostRepo.addnewRoom(roomData)
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

    async getListings(id:string){
        const roomData = await this.IHostRepo.getListings(id)
        if (roomData.length > 0) {
            return {
                status: 200,
                data: roomData
            }
        } else {
            return {
                status: 400,
                data: {
                    message: "No Room Data Found"
                }
            }
        }
    }

    async unlist(id: string) {
        const roomData = await this.IHostRepo.findById(id)
        if (roomData) {
            const update = { is_listed: !roomData?.is_listed }
            await this.IHostRepo.findOneAndUpdate(id, update)
            return {
                status: 200,
                data: update
            }
        } else {
            return {
                status: 400,
                data: {
                    message: "Failed to unlist"
                }
            }
        }
    }
}

export default UserHostUsecase