import mongoose from "mongoose";

export const connectDB=async()=>{
    try{
        const mongo_uri="mongodb+srv://x2cvicious123:n3rLzUNO8oyCXZBE@cluster0.iftaqh1.mongodb.net/bookaday?retryWrites=true&w=majority";
        if(mongo_uri){
            await mongoose.connect(mongo_uri)
            console.log("Connected to database")
        }
    }catch(err){
        console.log(err)
    }
}