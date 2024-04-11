import { Request, Response } from "express";
import Userusecase from "../use_case/userUsecases";
import sendMail from "../infrastructure/utils/sendMail";
import CloudinarySetup from "../infrastructure/utils/cloudinarySetup";
import GenerateOTP from "../infrastructure/utils/generateOtp";
import jwt, { JwtPayload } from "jsonwebtoken";
import ChatUseCase from "../use_case/chatUseCase";
import User from "../domain/user";

class UserController {
  private userCase: Userusecase;
  private sendMailer: sendMail;
  private CloudinarySetup: CloudinarySetup
  private genOtp: GenerateOTP;
  private chatuseCase:ChatUseCase;

  constructor(userCase: Userusecase, sendMailer: sendMail, CloudinarySetup: CloudinarySetup, genOtp: GenerateOTP, chatuseCase: ChatUseCase) {
    this.userCase = userCase;
    this.sendMailer = sendMailer;
    this.CloudinarySetup =CloudinarySetup;
    this.genOtp= genOtp;
    this.chatuseCase = chatuseCase
  }

  async signup(req: Request, res: Response) {
    try {
      const user = await this.userCase.signup(req.body)
      if(user.data.status===true && req.body.is_google==true){
        const user= await this.userCase.newUser(req.body)
        res.status(user.status).json(user.data);
      }else if(user.data.status===true){
        req.app.locals.userData= req.body
        const otp = await this.genOtp.generateOtp(4)
        console.log(otp);
        req.app.locals.otp = otp;
        this.sendMailer.sendVerificationEmail(req.body.email, otp);
        res.status(user.status).json(user.data);
      } else {
        res.status(user.status).json(user.data);
      }
    } catch (error) {
     console.log(error);
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const message ="OTP resent successfully"
      const email = req.app.locals.userData.email
      const otpR = await this.genOtp.generateOtp(4)
      req.app.locals.otp = otpR;
      this.sendMailer.sendVerificationEmail(email, otpR);
      res.status(200).json(message);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async resetPass1(req: Request, res: Response) {
    try {
      const user = await this.userCase.resetPass1(req.body.email)
      console.log(user)
      if (user.data.state === true && user?.data?.data && user.data.data.is_google == true) {
        const status= 200
        const data= {
          state:false,
          message:'Password reset is not available for Google signed-up accounts'
        }
        res.status(status).json(data);
      } else if (user.data.state === true && user?.data?.data&& user.data.data.is_google!=true && user.data.data.is_verified==true) {
        const data={
          state:true,
          message: "OTP sent successfully"
        }
        const email = req.body.email
        req.app.locals.email= email
        const otp = await this.genOtp.generateOtp(4)
        req.app.locals.otp = otp;
        this.sendMailer.sendVerificationEmail(email, otp);
        res.status(200).json(data);
      }else if (user.data.state===false){
        const data = {
          state: false,
          message: "No user found"
        }
        res.status(200).json(data);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async resetPass2(req: Request, res: Response) {
    try {
      let otpF=req.body.otp
      let otpR = req.app.locals.otp
      if (otpR=== otpF) {
        req.app.locals.otp = null;
        const status= 200
        const data={
          state:true,
          message:'Verification success'
        }
        res.status(status).json(data);
      } else {
        const data={
          message: "Invalid OTP"
        }
        res.status(400).json(data);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async resendOtp2(req: Request, res: Response) {
    try {
      const message = "OTP resent successfully"
      const email = req.app.locals.email
      const otpR = await this.genOtp.generateOtp(4)
      req.app.locals.otp = otpR;
      this.sendMailer.sendVerificationEmail(email, otpR);
      res.status(200).json(message);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async setnewpass(req: Request, res: Response) {
    try {
      const email = req.app.locals.email
      const user = await this.userCase.resetPass1(email);
      if (user) {
        const updated = await this.userCase.updatePass(email, req.body.password)
       res.status(updated.status).json(updated)
      }else{
        const data= {
          message:'Failed to updated password'
        }
        res.status(400).json(data)
      }
    } catch (err) {
      console.log(err);
      res.status(401).json(err);
    }
  } 
  async verifyotp(req: Request, res: Response) {
    try {
        let otpF=req.body.otp
      let otpR = req.app.locals.otp
      if (otpR=== otpF) {
        const user = await this.userCase.newUser(req.app.locals.userData);
        req.app.locals.userData = null;
        res.status(user.status).json(user.data);
      } else {
        res.status(400).json({ error: "Invalid OTP" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async login(req: Request, res: Response) {
  try {
    const user = await this.userCase.login(req.body);
    if (user) {
      const id = (user?.data?.message as User)?._id;
      await this.userCase.saveRefreshToken(id, user.data.refreshToken);
      res.cookie('userJWT', user.data.accessToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.cookie('refreshToken', user.data.refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 30 * 24 * 60 * 60 * 1000 
      });
      const { accessToken, refreshToken, ...userData } = user.data;
      res.status(user?.status).json(userData);
    }
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
}

  async logout(req: Request, res: Response) {
    try {
      res.cookie("userId","",{
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json("Logged Out Successfully");
    } catch (error) {
      console.log(error)
    }
  }

  async profile(req: Request, res: Response) {
    try {
      const token = req.cookies.userJWT
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
      const Id = decoded.userId
      const user = await this.userCase.profile(Id);
      res.status(user.status).json(user.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json(err.message);
    } 
  }

  async saveFcmtoken(req: Request, res: Response) {
    try {
      const token = req.cookies.userJWT
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
      const Id = decoded.userId;
      const output = await this.userCase.saveFcmtoken(Id, req.body.fcmtoken);
      res.status(output?.status ?? 200).json(output?.message ?? 'Success');
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json(err.message);
    }
  }

  async getUser(req: Request, res: Response) {
    try {
     const Id=req.params.id
      const user = await this.userCase.profile(Id);
      res.status(user.status).json(user.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json(err.message);
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      if (req.file) {
        const img = await this.CloudinarySetup.upload(req.file.path,"profile-pics");
        const imgUrl = img?.secure_url || "";
        const data = req.body;
        data.profilePic = imgUrl;
        const user = await this.userCase.updateProfile(req.userId || '', data, req.body.newPassword);
        res.status(user.status).json(user.data);
      } else {
        const user = await this.userCase.updateProfile(req.userId || '', req.body, req.body.newPassword);
        res.status(user.status).json(user.data);
      }
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json(err.message);
    }
  }

  async uploadId(req: Request, res: Response) {
    try {
      const userId = req.params.id
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded. Please upload a file." });
      }
      const img = await this.CloudinarySetup.upload(req.file.path, "profile-pics");
      const imgUrl = img?.secure_url || "";
      const user = await this.userCase.updateId(userId || '', imgUrl);
      res.status(user.status).json(user.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({ message: err.message });
    }
  }

}

export default UserController;
