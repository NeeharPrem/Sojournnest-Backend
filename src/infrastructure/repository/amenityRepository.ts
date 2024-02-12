import Amenities from "../../domain/amenities";
import { AmenitiesModel } from "../database/amenitiesModel";
import IAmenities from "../../use_case/interface/amenityRepo";

interface EditAmenityData {
    value: string;
    index: number;
}
class AmenityRepository implements IAmenities {
    async newEntry(data: Amenities): Promise<Amenities> {
        const newData = new AmenitiesModel({amenities:[data]});
        await newData.save();
        return newData;
    }

    async findAmenity() {
        try {
            const newData = await AmenitiesModel.find({})
            return newData
        } catch (error) {
            console.log(error)
        }
    }

    async updateOne(Data: Amenities, id: any) {
        try {
            const result = await AmenitiesModel.updateOne({ _id: id }, { $addToSet: { amenities: Data } });
            if (result.modifiedCount > 0) {
                return {
                    success: true,
                    message: 'Amenity added successfully.',
                    data: result
                };
            } else {
                return {
                    success: false,
                    message: 'No document found or no changes made.',
                    data: result
                };
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    async deleteEntry(amenity: string, id: string) {
        try {
            const result = await AmenitiesModel.updateOne({ _id: id }, { $pull: { amenities: amenity } });
            if (result.modifiedCount > 0) {
                return {
                    success: true,
                    message: 'Amenity removed successfully.',
                    data: result
                };
            } else {
                return {
                    success: false,
                    message: 'No document found or no changes made.',
                    data: result
                };
            }
        } catch (error:any) {
            console.error('An error occurred:', error);
        }
    }

    async editEntry(data: EditAmenityData, id: string) {
        try {
            const updateObject = { [`amenities.${data.index}`]: data.value };
            console.log(updateObject)
            const result = await AmenitiesModel.updateOne({ _id: id }, { $set: updateObject });
            console.log(result)
            if (result.modifiedCount > 0) {
                return {
                    success: true,
                    message: 'Amenity updated successfully.',
                    data: result
                };
            } else {
                return {
                    success: false,
                    message: 'No document found or no changes made.',
                    data: result
                };
            }
        } catch (error) {
            console.error('An error occurred:', error);
            return {
                success: false,
                message: 'An error occurred during the update process.',
                error: error
            };
        }
    }

}

export default AmenityRepository;
