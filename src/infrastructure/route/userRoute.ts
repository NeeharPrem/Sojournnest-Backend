import userController from "../../adapter/userController";
import userRepository from "../repository/userRepository";
import Userusecase from "../../use_case/userUsecases";
import Encrypt from "../passwordRepository/hashpassword";
import express, { Router } from "express";
import GenerateOTP from "../utils/generateOtp";
import jwtPassword from "../passwordRepository/jwtpassword";
import nodemailerUtils from "../utils/sendMail";
import { protect } from "../middleware/userAuth";
import CloudinarySetup from "../utils/cloudinarySetup";
import { ImageUpload } from '../middleware/multer';


const encrypt = new Encrypt();
const JWTPassword = new jwtPassword();
const sendMail = new nodemailerUtils();
const cloudinary= new CloudinarySetup();
const generateOtp= new GenerateOTP()

const repository= new userRepository();

const useCase=new Userusecase(encrypt,repository,JWTPassword)

const controller=new userController(useCase,sendMail,cloudinary,generateOtp)

const router=express.Router();

router.post("/signup",(req,res)=>controller.signup(req,res));
router.post("/signupVerification",(req,res)=>controller.signupVerification(req,res))
router.post("/login",(req,res)=>controller.login(req,res));
router.post("/logout",(req,res)=>controller.logout(req,res));

router.get("/profile", protect, (req, res) => controller.profile(req, res))
router.put("/updateProfile", protect, ImageUpload.single('avatar'),(req,res)=>controller.updateProfile(req,res))

export default router