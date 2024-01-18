import { AdminModel } from "../database/adminModel";
import { UserModel } from "../database/useModel";
import AdminRepo from "../../use_case/interface/adminRepo";
import Admin from "../../domain/admin";
import User from "../../domain/user";

class AdminRepository implements AdminRepo {
    async findByEmail(email: string): Promise<Admin | null> {
        const admin = await AdminModel.findOne({ email });
        return admin;
    }

    async findById(_id: string): Promise<User | null> {
        try {
            const admin = await UserModel.findById(_id).exec();
            return admin;
        } catch (error) {
            console.error('Error in findById:', error);
            return null;
        }
    }

    async findUsers(): Promise<any> {
        const users = await UserModel.find({})
        if (users) {
            return users
        } else {
            return null
        }
    }

    async blockUser(userId: string): Promise<Admin | null> {
        try {
            const admin = await AdminModel.findByIdAndUpdate(userId, { isBlocked: true }, { new: true }).exec();
            return admin;
        } catch (error) {
            console.error('Error in blockUser:', error);
            return null;
        }
    }
}

export default AdminRepository;