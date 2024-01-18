import jwtToken from "../infrastructure/passwordRepository/jwtpassword";
import Admin from "../domain/admin";
import Encrypt from "../infrastructure/passwordRepository/hashpassword";
import userRepository from "../infrastructure/repository/userRepository";
import AdminRepository from "../infrastructure/repository/adminRepository";

class adminUsercases{
    private JWTToken: jwtToken;
    private Encrypt : Encrypt
    private userRepository: userRepository
    private AdminRepository: AdminRepository

    constructor( 
        Encrypt: Encrypt,
        userRepository: userRepository,
        JWTToken: jwtToken,
        AdminRepository:AdminRepository
    ){
        (this.Encrypt=Encrypt),
        (this.JWTToken= JWTToken),
        (this.userRepository=userRepository),
        (this.AdminRepository=AdminRepository)
    }

    async login(admin:Admin){
        try {
            const adminData= await this.AdminRepository.findByEmail(admin.email)
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
            const users=await this.AdminRepository.findUsers()
            if(users){
                return {
                    status:200,
                    data:users
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
}

export default adminUsercases