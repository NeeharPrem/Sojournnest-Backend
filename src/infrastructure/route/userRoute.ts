import userController from "../../adapter/userController";
import UserHostController from "../../adapter/userhsotController";
import userRepository from "../repository/userRepository";
import HostRepository from "../repository/HostRepository";
import Userusecase from "../../use_case/userUsecases";
import UserHostUsecase from "../../use_case/userhostUsecase";
import Encrypt from "../passwordRepository/hashpassword";
import express  from "express";
import GenerateOTP from "../utils/generateOtp";
import jwtPassword from "../passwordRepository/jwtpassword";
import nodemailerUtils from "../utils/sendMail";
import { protect } from "../middleware/userAuth";
import CloudinarySetup from "../utils/cloudinarySetup";
import { ImageUpload } from '../middleware/multer';
import ChatUseCase from "../../use_case/chatUseCase";
import conversationRepository from "../repository/conversationRepository";
import MessageRepository from "../repository/messageRespository";


const encrypt = new Encrypt();
const JWTPassword = new jwtPassword();
const sendMail = new nodemailerUtils();
const cloudinary= new CloudinarySetup();
const generateOtp= new GenerateOTP()

const repository= new userRepository();
const repositoryHost= new HostRepository()
const repositoryChat= new conversationRepository()
const repositoryMessage=new MessageRepository()

const useCase=new Userusecase(encrypt,repository,JWTPassword)
const hostuseCase= new UserHostUsecase(repositoryHost,cloudinary)
const chatuseCase= new ChatUseCase(repository,repositoryChat,repositoryMessage)

const controller = new userController(useCase, sendMail, cloudinary, generateOtp, chatuseCase)
const hostcontroller= new UserHostController(hostuseCase,chatuseCase)

const router=express.Router();

//user
router.post("/", (req, res) => controller.signup(req, res));
router.post("/verify-otp", (req, res) => controller.verifyotp(req,res))
router.post("/resend-otp", (req, res) => controller.resendOtp(req, res))
router.get("/", protect, (req, res) => controller.profile(req, res))
router.patch("/:id", protect, ImageUpload.single('avatar'),(req,res)=>controller.updateProfile(req,res))
router.get('/listings/:id',(req, res) => hostcontroller.roomDetail(req, res))
//user chats
router.post('/chat', (req, res) => controller.newConversation(req,res))

// host 
router.get('/host/listings',(req,res)=>hostcontroller.getListings(req,res))
router.put('/host/listings', protect, ImageUpload.array('images'),(req,res)=>hostcontroller.addRoom(req,res))
router.get('/host/listings/:id', protect, (req, res) => hostcontroller.roomData(req, res))
router.patch('/host/listings/:id', protect,(req,res)=>hostcontroller.unlist(req,res))
router.put('/host/listings/:id', protect, ImageUpload.array('images'), (req, res) => hostcontroller.roomDataUpdate(req, res))

// getting the listing data
router.get('/listings', (req, res) => hostcontroller.allListings(req, res));

// host chat
router.post('/host/chat', (req, res) => hostcontroller.newConversation(req, res))
router.get('/host/chat/:id', (req, res) => hostcontroller.getConversations(req, res))
router.post('/host/chat/messages',(req,res)=>hostcontroller.addMessage(req,res))
router.get('/host/chat/messages/:id',(req,res)=>hostcontroller.getMessages(req,res))
router.get("/:id", (req, res) => controller.getUser(req, res))

export default router