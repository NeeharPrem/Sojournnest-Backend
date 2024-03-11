import mongoose, { Document, Schema, ObjectId } from "mongoose";

interface Rooms extends Document {
    images: string[];
    guests: string;
    bedrooms: string;
    bathrooms: string;
    is_blocked: boolean;
    is_approved:boolean;
    is_listed:boolean;
    amenities: string[];
    subdescription: string;
    _id: string;
    longitude: number;
    name: string;
    latitude: number;
    description: string;
    userId: ObjectId;
    rent: string;
    state: string;
    district: string;
    category: string;
    blockedDates: string[];
}

const roomsSchema: Schema<Rooms> = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    longitude: {
        type: Number,
        required: true,
        trim: true,
    },
    latitude: {
        type: Number,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    is_blocked: {
        type: Boolean,
        default: false,
    },
    amenities: {
        type: [String],
        default: [],
    },
    subdescription: {
        type: String,
        default: "",
    },
    bedrooms: {
        type: String,
        default: "",
    },
    bathrooms: {
        type: String,
        default: "",
    },
    rent: {
        type: String,
        default: "",
    },
    images: {
        type: [String],
        default: [],
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    state: {
        type: String,
        default: "",
    },
    district: {
        type: String,
        default: "",
    },
    category: {
        type: String,
        default: "",
    },
    guests:{
        type:String
    },
    is_approved:{
        type:Boolean,
        default:false
    },
    is_listed:{
        type:Boolean,
        default:true
    },
    blockedDates: [{
        name:{
            type:String,
            required:true
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        }
    }]
},
    {
        timestamps: true,
    });

const RoomsModel = mongoose.model<Rooms>("Rooms", roomsSchema);

export { Rooms, RoomsModel };
