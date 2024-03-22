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
      const otp = await this.genOtp.generateOtp(4)
      let otpObj={
        otp: otp,
        timestamp: Date.now()
      }
      console.log(otpObj)
      req.app.locals.otp = otpObj;
      this.sendMailer.sendVerificationEmail(email, otp);
      res.status(200).json(message);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async verifyotp(req: Request, res: Response) {
    try {
      console.log(req.app.locals.otp,'otploc',req.body.otp,'otpbo')
        let otp=req.body.otp
        let otpObj=req.app.locals.otp
      if (!otpObj) {
        return res.status(400).json({ error: "OTP not found or has expired." });
      }
      const currentTime = Date.now();
      const oneHour = 60 * 60 * 1000;
      if (currentTime - otpObj.timestamp > oneHour) {
        return res.status(400).json({ error: "OTP has expired." });
      }
      if (otp === otpObj) {
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

  async getUser(req: Request, res: Response) {
    try {
     const Id=req.params.id
     console.log(Id,'in getuser')
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
