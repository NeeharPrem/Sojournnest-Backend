import Amenities from "../domain/amenities";
import IAmenities from "./interface/amenityRepo";

class AmenitiesUsecase{
    private IAmenities:IAmenities

    constructor(
        IAmenities:IAmenities
    ){
        this.IAmenities=IAmenities
    }

    async newEntry(Data:Amenities){
        try {
            const outData = await this.IAmenities.findAmenity()
            if(outData.length>0){
                const id=outData[0]._id
                const result = await this.IAmenities.updateOne(Data,id);
                if (result.success ==true){
                    return {
                        status:200,
                        data:{
                            message:"New amenity added"
                        }
                    }
                }else{
                    return {
                        status:409,
                        data:{
                            message:"Amenity already exisist"
                        }
                    }
                }
            }else{
                const amenity = await this.IAmenities.newEntry(Data)
                if (amenity) {
                    return {
                        status: 200,
                        data: {
                            message: "Amenity added"
                        }
                    }
                }
            }
        } catch (error) {
            return{
                status:400,
                data:{
                    message:"Failed to add"
                }
            }
        }
    }

    async findAmenity() {
        try {
            const Data = await this.IAmenities.findAmenity()
            if (Data.length > 0) {
                return {
                    status:200,
                    data:{
                       data:Data,
                       message:'Amenities'
                    },
                }
            }else{
                return {
                    status:400,
                    data:{
                        message:"No amenities"
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteEntry(data:string,id:string) {
        try {
            const Data = await this.IAmenities.deleteEntry(data,id)
            if (Data.success==true) {
                return {
                    status: 200,
                    data: {
                        message: 'Amenity Deleted'
                    }
                }
            } else {
                return {
                    status: 400,
                    data: {
                        message: "Failed to delete"
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default AmenitiesUsecase