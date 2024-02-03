import mongoose, { Document, Schema } from "mongoose";

interface IAmenities extends Document {
    amenities: string[];
}

const amenitiesSchema: Schema<IAmenities> = new mongoose.Schema({
    amenities: {
        type: [String],
    }
});

const AmenitiesModel = mongoose.model<IAmenities>("Amenities", amenitiesSchema);

export { IAmenities, AmenitiesModel };