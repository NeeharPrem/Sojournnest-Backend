import Amenities from "../../domain/amenities";

interface IAmenities{
    newEntry(amenity:Amenities):Promise<Amenities>;
    findAmenity(): Promise<any>;
    updateOne(amenity:Amenities,id:string):Promise<any>
    deleteEntry(Data: string, id: string):Promise<any>
    editEntry(Data: object, id: string): Promise<any>
}
export default IAmenities