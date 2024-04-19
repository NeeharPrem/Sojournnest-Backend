import mongoose from "mongoose";

export const connectDB=async()=>{
    try{
        const mongo_uri = process.env.MONGO_URI;
        if(mongo_uri){
            await mongoose.connect(mongo_uri)
            console.log("Connected to database")
        }
    }catch(err){
        console.log(err)
    }
}