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

    async findUsers(page: number = 1, pageSize: number = 10): Promise<any> {
        try {
            const users = await UserModel.find({})
                .limit(pageSize)
                .skip((page - 1) * pageSize);
            return users;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

}

export default AdminRepository;