import userController from "../../adapter/userController";
import UserHostController from "../../adapter/userhsotController";
import userRepository from "../repository/userRepository";
import HostRepository from "../repository/HostRepository";
import Userusecase from "../../use_case/userUsecases";
import UserHostUsecase from "../../use_case/userhostUsecase";
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
const repositoryHost= new HostRepository()

const useCase=new Userusecase(encrypt,repository,JWTPassword)
const hostuseCase= new UserHostUsecase(repositoryHost,cloudinary)

const controller=new userController(useCase,sendMail,cloudinary,generateOtp)
const hostcontroller= new UserHostController(hostuseCase)

const router=express.Router();

router.post("/signup",(req,res)=>controller.signup(req,res));
router.post("/signupVerification",(req,res)=>controller.signupVerification(req,res))
router.post("/login",(req,res)=>controller.login(req,res));
router.post("/logout",(req,res)=>controller.logout(req,res));

router.get("/profile", protect, (req, res) => controller.profile(req, res))
router.put("/updateProfile", protect, ImageUpload.single('avatar'),(req,res)=>controller.updateProfile(req,res))

// host adding rooms
router.put('/addRoom', ImageUpload.array('images'),(req,res)=>hostcontroller.addRoom(req,res))
router.get('/getListings',(req,res)=>hostcontroller.getListings(req,res))
router.post('/unlist/:id',(req,res)=>hostcontroller.unlist(req,res))
router.get('/roomData/:id', (req, res) => hostcontroller.roomData(req, res))
router.put('/roomDataUpdate/:id', ImageUpload.array('images'), (req, res) => hostcontroller.roomDataUpdate(req, res))
router.get('/homeListings', (req, res) => hostcontroller.allListings(req, res))
export default router