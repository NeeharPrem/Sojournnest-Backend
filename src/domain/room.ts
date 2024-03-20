import { ObjectId } from "mongoose";

interface Room {
    [x: string]: any;
    images?: Array<Object> | any;
    guests: string;
    bedrooms: string;
    bathrooms: string;
    is_blocked: boolean;
    is_approved:boolean;
    is_listed:boolean;
    amenities: string[];
    subdescription: string;
    _id?: string;
    longitude: number;
    name: string;
    latitude: number;
    description: string;
    userId: ObjectId;
    rent: number;
    state: string;
    district: string;
    category: string;
}

export default Room;