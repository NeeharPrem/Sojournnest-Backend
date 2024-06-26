import User from "../../domain/user";

interface IUserRepo {
    save(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(_id: string): Promise<User | null>;
    findOneAndUpdate(query: any, update: any, options?: any): Promise<User | null>;
    saveFcmtoken(id:string,fcmtoken:string):Promise<any>
    updateRefreshToken(_id: string, refreshToken: string): Promise<User | null>;
    findAndUpdate(user: User): Promise<any>
}

export default IUserRepo;