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
  
  // async updateWalletBalance(userId: string, price: number, actionType: string): Promise<boolean> {
  //   try {
  //     const user = await this.findById(userId);
  //     if (user && user.wallet) {
  //       const walletBalance = user.wallet;
  //       const newWalletBalance = actionType === 'increment' ? walletBalance + price : walletBalance - price;
  //       const updated = await UserModel.updateOne({ _id: userId }, { $set: { wallet: newWalletBalance } });
  //       if (updated) return true;
  //     }
  //     return false;
  //   } catch (error) {
  //     return false;
  //   }

  // }
}
export default userRepository;