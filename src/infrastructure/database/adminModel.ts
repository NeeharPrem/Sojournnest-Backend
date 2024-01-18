import mongoose, { Document, Schema, ObjectId } from "mongoose";

interface Admin extends Document {
    _id: string;
    email: string;
    password: string;
}

const adminSchema: Schema<Admin> = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim:true
    },
    password:{
        type:String,
        required:true
    }
})

const AdminModel= mongoose.model<Admin>("Admin",adminSchema);

export {Admin,AdminModel}