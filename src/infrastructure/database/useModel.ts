import mongoose, { Document, Schema, ObjectId} from "mongoose";

interface IUser extends Document {
  _id: string;
  fname:string;
  lname:string;
  email: string;
  password: string;
  is_blocked:boolean;
  is_google:boolean;
  is_verified:boolean;
  mobile:string;
  profilePic:string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  lname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
   is_blocked: {
    type: Boolean,
    default: false,
  },
   is_verified: {
    type: Boolean,
    default: false,
  },
  is_google: {
    type: Boolean,
    default: false,
  },
  mobile:{
    type:String,
  },
  profilePic:{
    type:String,
    default:"https://res.cloudinary.com/db5rtuzcw/image/upload/fl_attachment/v1/profile-pics/smfqucbsselfp94orxqc"
  }
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export {IUser,UserModel};