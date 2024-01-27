import jwtToken from "../infrastructure/passwordRepository/jwtpassword";
import Admin from "../domain/admin";
import Encrypt from "../infrastructure/passwordRepository/hashpassword";
import IHostRepo from "./interface/hostRepo";
import IAdminRepo from "./interface/adminRepo";
import IUserRepo from "./interface/userRepo";

class adminUsercases{
    private JWTToken: jwtToken;
    private Encrypt : Encrypt
    private IUserRepo: IUserRepo
    private IAdminRepo: IAdminRepo
    private IHostRepo: IHostRepo

    constructor( 
        Encrypt: Encrypt,
        IUserRepo: IUserRepo,
        JWTToken: jwtToken,
        IAdminRepo: IAdminRepo,
        IHostRepo: IHostRepo
    ){
        (this.Encrypt=Encrypt),
        (this.JWTToken= JWTToken),
            (this.IUserRepo = IUserRepo),
            (this.IAdminRepo = IAdminRepo),
        (this.IHostRepo = IHostRepo)
    }

    async login(admin:Admin){
        try {
            const adminData = await this.IAdminRepo.findByEmail(admin.email)
            if(adminData && adminData._id){
                    const passwordMatch = await this.Encrypt.compare(admin.password,adminData.password)
                    if(passwordMatch){
                       const  token = this.JWTToken.generateToken(adminData._id, 'admin');
                       return {
                        status : 200,
                        data:{
                            data:adminData,
                            message: "Logged in",
                            token
                        }
                       }
                    }else{
                        return {
                            status: 400,
                            data:{
                                message:"Invalid Email or Password",
                                toke:null
                            }
                        }
                    }
            }else{
                return {
                    status: 400,
                    data:{
                        message:"Invalid Email or Password",
                        token:null
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async findUsers() {
        try {
            const Data = await this.IAdminRepo.findUsers()
            if(Data){
                return {
                    status:200,
                    data:{
                        info:'user',
                        data: Data
                    }
                }
            }else{
                return {
                    status: 400,
                    data:"No users found"
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async blockUser(id: any) {
        try {
            const user = await this.IUserRepo.findById(id);
            if (user) {
                const { is_blocked, ...userData } = user.toObject();
                const update = { is_blocked: !is_blocked, ...userData };
                await this.IUserRepo.findAndUpdate(update);
                return {
                    status:200,
                    data:update
                }
            }else{
                return {
                    status: 404,
                    data: "User Not Found"
                }
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async findListings() {
        try {
            const Data = await this.IHostRepo.findListings()
            if (Data) {
                return {
                    status: 200,
                    data: {
                        info: "listings",
                        data:Data
                    }
                }
            } else {
                return {
                    status: 400,
                    data: "No Location to List"
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async approveListing(id:any){
        try {
            const Data=await this.IHostRepo.findById(id)
            if(Data){
                const update={is_approved:!Data.is_approved}
                await this.IHostRepo.findOneAndUpdate(id,update)
                return {
                    status: 200,
                    data: update
                }
            } else {
                return {
                    status: 400,
                    data: "Failed to Approve"
                }
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    async blockListing(id: any) {
        try {
            const Data = await this.IHostRepo.findById(id);
            if (Data) {
                const update = { is_blocked: !Data?.is_blocked};
                await this.IHostRepo.findOneAndUpdate(id,update);
                return {
                    status: 200,
                    data: update
                }
            } else {
                return {
                    status: 400,
                    data: "Failed to block"
                }
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}

export default adminUsercases