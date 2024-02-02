import User from "../domain/user";
import Encrypt from "../infrastructure/passwordRepository/hashpassword";
import UserRepository from "../infrastructure/repository/userRepository";
import jwtToken from "../infrastructure/passwordRepository/jwtpassword";
import IHostRepo from "./interface/hostRepo";

class UserUseCase {
  private Encrypt: Encrypt;
  private UserRepository: UserRepository;
  private JWTToken: jwtToken;

  constructor(
    Encrypt: Encrypt,
    UserRepository: UserRepository,
    JWTToken: jwtToken,
  ) {
    (this.Encrypt = Encrypt),
    (this.UserRepository = UserRepository),
    (this.JWTToken = JWTToken);
  }

  async signup(user: User) {
    const existingUser = await this.UserRepository.findByEmail(user.email);
    if (existingUser) {
      return {
        status: 401,
        data: {
          status:false,
          message: "User already exists",
        }
      };
    } else {
      return {
        status: 200,
        data: {
          status: true,
          message: 'Verification otp sent to your email!'
        }
      };
    }
  }

  async newUser(user:User){
    const hashedPass = await this.Encrypt.generateHash(user.password)
    const newUser = { ...user,is_verified:true,password: hashedPass }
    await this.UserRepository.save(newUser);
    return {
      status: 200,
      data: { status: true, message: 'Registration successful!' }
    }
  }


  async login(user: User) {
    try {
      const userData = await this.UserRepository.findByEmail(user.email);
      let accessToken = '';
      let refreshToken='';

      if (userData) {
        if (userData.is_blocked) {
          return {
            status: 400,
            data: {
              message: 'You have been blocked by admin!',
              token: ''
            }
          };
        }

        const passwordMatch = await this.Encrypt.compare(user.password, userData.password);

        if (passwordMatch || userData.is_google) {
          const userId = userData?._id;
          if (userId) {
            accessToken = this.JWTToken.generateAccessToken(userId, 'user');
            refreshToken = this.JWTToken.generateRefreshToken(userId);
            return {
              status: 200,
              data: {
                message: userData,
                accessToken,
                refreshToken
              }
            };
          }
        } else {
          return {
            status: 400,
            data: {
              message: 'Invalid email or password!',
              accessToken
            }
          };
        }
      } else {
        return {
          status: 400,
          data: {
            message: 'Invalid email or password!',
            accessToken
          }
        };
      }
    } catch (error) {
      console.error('Login failed:', error);

      return {
        status: 500,
        data: {
          message: 'Internal server error',
          token: ''
        }
      };
    }
  }

  async profile(_id: string) {
    const getUser = await this.UserRepository.findById(_id);
    if (getUser) {
      return {
        status: 200,
        data: getUser,
      };
    } else {
      return {
        status: 400,
        data: "User not found",
      };
    }
  }

   
  async updateProfile(id: string, user: User, newPassword?: string) {
    const userData = await this.UserRepository.findOneAndUpdate(id, {
      fname: user.fname,
      lname: user.lname,
      mobile: user.mobile,
      profilePic: user.profilePic,
    });

    if (userData) {
      if (user.password) {
        const passwordMatch = await this.Encrypt.compare(user.password, userData.password);

        if (passwordMatch && newPassword) {
          const updatedUserData = await this.UserRepository.findOneAndUpdate(id, {
            password: await this.Encrypt.generateHash(newPassword),
          });

          return {
            status: 200,
            data: updatedUserData,
          };
        } else {
          return {
            status: 400,
            data: { message: 'Password does not match!' },
          };
        }
      }

      return {
        status: 200,
        data: userData,
      };
    } else {
      return {
        status: 400,
        data: { message: 'User not found' },
      };
    }
  }

}

export default UserUseCase;