import User from "../../domain/user";
import { UserModel } from "../database/useModel";
import UserRepo from "../../use_case/interface/userRepo";

class userRepository implements UserRepo {
  async save(user: User): Promise<User> {
    const newUser = new UserModel(user);
    await newUser.save();
    return newUser;
  }

  async findById(_id: string): Promise<User | null> {
    const user = await UserModel.findById({ _id });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user;
  }

  async findAllUsers(): Promise<{}[] | any> {
    const users = await UserModel.find({}).select('-password');
    return users;
  }

  async findOneAndUpdate(_id: string, update: Partial<User>): Promise<User | null> {
    const user = await UserModel.findOneAndUpdate(
      { _id },
      { $set: update },
      { new: true }
    );
    return user;
  }
  
}
export default userRepository;