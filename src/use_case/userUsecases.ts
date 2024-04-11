import User from "../domain/user";
import Encrypt from "../infrastructure/passwordRepository/hashpassword";
import UserRepository from "../infrastructure/repository/userRepository";
import jwtToken from "../infrastructure/passwordRepository/jwtpassword";

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

  async resetPass1(email:string) {
    const existingUser = await this.UserRepository.findByEmail(email);
    if (existingUser) {
      return {
        status: 200,
        data: {
          state: true,
          data: existingUser,
          message: "User exisists",
        }
      };
    } else {
      return {
        status: 400,
        data: {
          state: false,
          message: 'No user found'
        }
      };
    }
  }

  async updatePass(email: string, newPassword: string) {
    const userData = await this.UserRepository.findByEmail(email);
    if (!userData) {
      return { status: 404, data: { message: 'User not found.' } };
    }
    if (userData.isGoogleAccount) {
      return { status: 400, data: { message: 'Password reset is not available for Google signed-up accounts. Please use Google to log in.' } };
    }

    const isSamePassword = await this.Encrypt.compare(newPassword, userData.password);
    if (isSamePassword) {
      return { status: 400, data: { message: 'The new password must be different from the current password' } };
    }
    const id = userData._id;
    if (id) {
        const updatedUserData = await this.UserRepository.findOneAndUpdate(id, { password: await this.Encrypt.generateHash(newPassword) });
        return { status: 200, data: updatedUserData, message: 'Password changed' };
    } else {
        return { status: 400, data: { message: 'User ID is undefined.' } };
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

  async saveFcmtoken(_id: string,fcmtoken:string) {
    const getUser = await this.UserRepository.findById(_id);
    if (getUser) {
      const updatedUser= await this.UserRepository.saveFcmtoken(_id,fcmtoken)
      if (!updatedUser) {
        return {
          status: 400,
          message: "User not found",
        };
      } else {
        console.log("FCM token updated successfully");
        return {
          status: 200,
          message: "FCM token updated successfully",
        };
      }
  }
}

   
  async updateProfile(id: string, user: User, newPassword?: string) {
    const userData = await this.UserRepository.findOneAndUpdate(id, {
      fname: user.fname,
      lname: user.lname,
      mobile: user.mobile,
      profilePic: user.profilePic,
      verifyId:user.verifyId
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

  async updateEmail(id: string, email: string) {
    const updatedUserData = await this.UserRepository.findOneAndUpdate(id, { email: email });
    if (!updatedUserData) {
      return {
        status: 400,
        data: { message: 'User not found' },
      };
    }
    return {
      status: 200,
       data:{
        message:'Email updated',
       }
    };
  }


  async updateId(id: string, verifyId:string) {
    console.log(id,'idd')
    const userData = await this.UserRepository.findOneAndUpdate(id, {
      verifyId:verifyId
    });
    if (userData) {
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

  async saveRefreshToken(id: string | undefined,refreshToken:string | undefined) {
    const User = await this.UserRepository.updateRefreshToken(id,refreshToken);
    if (User) {
      return {
        status: 200,
        data: User,
      };
    } else {
      return {
        status: 400,
        data: "Failed to add Token",
      };
    }
  }

}

export default UserUseCase;