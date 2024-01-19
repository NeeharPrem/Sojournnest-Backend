import Admin from "../../domain/admin";
import User from "../../domain/user";

interface AdminRepo {
    findByEmail(email: string): Promise<Admin | null>;
    findById(_id: string): Promise<User | null>;
    findUsers(): Promise<any>;
}

export default AdminRepo;
