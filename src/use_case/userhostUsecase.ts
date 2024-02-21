import Room from "../domain/room"
import CloudinarySetup from "../infrastructure/utils/cloudinarySetup"
import IHostRepo from "./interface/hostRepo"


class UserHostUsecase {
    private IHostRepo: IHostRepo
    private CloudinarySetup: CloudinarySetup

    constructor(
        IHostRepo: IHostRepo,
        CloudinarySetup: CloudinarySetup
    ){
        this.IHostRepo = IHostRepo;
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
                    message: "No Listings Added"
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

    async roomData(id: string) {
        console.log(id)
        const roomData = await this.IHostRepo.findById(id)
        if (roomData) {
            return {
                status: 200,
                data: roomData
            }
        } else {
            return {
                status: 400,
                data: {
                    message: "Failed to get Data"
                }
            }
        }
    }

    async roomDetail(id: string) {
        const roomData = await this.IHostRepo.findById(id)
        if (roomData) {
            return {
                status: 200,
                data: roomData
            }
        } else {
            return {
                status: 400,
                data: {
                    message: "Failed to get Data"
                }
            }
        }
    }

    async roomDataUpdate(id: string, roomData: Partial<Room>) {
        console.log("here")
        try {
            const uploadImages = await Promise.all(
                roomData.images.map(async (file: any) => {
                    const result = await this.CloudinarySetup.upload(file.path, "Hosted-places");
                    return result?.secure_url;
                })
            );
            console.log(uploadImages)
            roomData.images = uploadImages
            const updatedData = await this.IHostRepo.findOneAndUpdate({ _id: id }, roomData, { new: true });
            if (updatedData) {
                return {
                    status: 200,
                    data: updatedData
                };
            } else {
                return {
                    status: 404,
                    data: {
                        message: "Room not found"
                    }
                };
            }
        } catch (error) {
            console.error("Error updating room data:", error);
            return {
                status: 500,
                data: {
                    message: "Internal server error"
                }
            };
        }
    }

    async findListings(search?: string, sort?: string, filters?: any) {
        try {
            console.log('2');
            let query: any = {};

            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: "i" } },
                    { state: { $regex: search, $options: "i" } },
                    { district: { $regex: search, $options: "i" } },
                ];
            }

            if (filters) {
                Object.keys(filters).forEach(key => {
                    if (key === 'category' && filters[key]) {
                        query['category'] = filters[key];
                    } else if (key === 'minPrice' && filters[key] !== undefined) {
                        if (!query['price']) query['price'] = {};
                        query['price'].$gte = filters[key];
                    } else if (key === 'maxPrice' && filters[key] !== undefined) {
                        if (!query['price']) query['price'] = {};
                        query['price'].$lte = filters[key];
                    }
                });
            }

            let sortOptions: any = {};
            // Assuming sorting by 'price' for 'high' and 'low'
            if (sort) {
                // Map 'high' to '-price' and 'low' to 'price' for sorting
                const sortField = 'price'; // Change this to the field you wish to sort by
                sortOptions[sortField] = sort === 'high' ? -1 : 1;
            }

            const Data = await this.IHostRepo.findAll(query, sortOptions);
            if (Data) {
                return {
                    status: 200,
                    data: {
                        info: "listings",
                        data: Data
                    }
                };
            } else {
                return {
                    status: 400,
                    data: "No Location to List"
                };
            }
        } catch (error) {
            console.error(error);
            return {
                status: 500,
                data: "An error occurred while fetching the listings."
            };
        }
    }

}

export default UserHostUsecase