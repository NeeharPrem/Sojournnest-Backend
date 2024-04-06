import Admin from "../../domain/admin";
import User from "../../domain/user";

interface IAdminRepo {
    findByEmail(email: string): Promise<Admin | null>;
    findById(_id: string): Promise<User | null>;
    findUsers(page: number, limit: number): Promise<any>;
}

export default IAdminRepo;
