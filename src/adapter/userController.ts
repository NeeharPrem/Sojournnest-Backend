import { Request, Response } from "express";
import Userusecase from "../use_case/userUsecases";
import sendMail from "../infrastructure/utils/sendMail";
import CloudinarySetup from "../infrastructure/utils/cloudinarySetup";
import GenerateOTP from "../infrastructure/utils/generateOtp";


class UserController {
  private userCase: Userusecase;
  private sendMailer: sendMail;
  private CloudinarySetup: CloudinarySetup
  private genOtp: GenerateOTP;

  constructor(userCase: Userusecase, sendMailer: sendMail, CloudinarySetup: CloudinarySetup, genOtp: GenerateOTP) {
    this.userCase = userCase;
    this.sendMailer = sendMailer;
    this.CloudinarySetup =CloudinarySetup;
    this.genOtp= genOtp;
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

  async signupVerification (req:Request,res:Response){
    try {
      if(req.body.otp===req.app.locals.otp){
        const user=await this.userCase.newUser(req.app.locals.userData)
        req.app.locals.userData= null;
        res.status(user.status).json(user.data)
      }else{
        res.status(400).json({ status: false, message: 'Invalid otp' });
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  async login(req: Request, res: Response) {
  try {
    const user = await this.userCase.login(req.body);
    if (user) {
      res.cookie('userJWT', user.data.token, {
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });
      res.status(user?.status).json(user.data);
    }
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
}

  async logout(req: Request, res: Response) {
    try {
      res.cookie("userId",{
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
      const userId = req.userId || '';
      const user = await this.userCase.profile(userId);
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
}

export default UserController;
