import { ObjectId } from "mongoose";

interface Room {
    images?: Array<Object> | any;
    guests: number;
    bedrooms: number;
    bathrooms: number;
    is_blocked: boolean;
    amenities: string[];
    subdescription: string;
    _id?: string;
    longitude: number;
    name: string;
    latitude: number;
    description: string;
    userId: ObjectId;
    rent: string;
    state: string;
    district: string;
    category: string;
}

export default Room;