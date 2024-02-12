import userController from "../../adapter/userController";
import userRepository from "../repository/userRepository";
import Userusecase from "../../use_case/userUsecases";
import AdminUsercases from "../../use_case/adminUsecases";
import AdminRepository from "../repository/adminRepository";
import AdminController from "../../adapter/adminController";
import HostRepository from "../repository/HostRepository";
import Encrypt from "../passwordRepository/hashpassword";
import jwtPassword from "../passwordRepository/jwtpassword";
import GenerateOTP from "../utils/generateOtp";
import nodemailerUtils from "../utils/sendMail";
import { protect } from "../middleware/userAuth";
import CloudinarySetup from "../utils/cloudinarySetup";
import express from "express";
import ChatUseCase from "../../use_case/chatUseCase";
import conversationRepository from "../repository/conversationRepository";
import MessageRepository from "../repository/messageRespository";

const encrypt = new Encrypt();
const JWTPassword = new jwtPassword();
const sendMail = new nodemailerUtils();
const cloudinary = new CloudinarySetup();
const generateOtp = new GenerateOTP()

const repository = new userRepository();
const adminRepository = new AdminRepository();
const hostRepository = new HostRepository()
const repositoryChat = new conversationRepository()
const repositoryMessage = new MessageRepository()

const useCase = new Userusecase(encrypt, repository, JWTPassword)
const admiUseCase = new AdminUsercases(encrypt, repository, JWTPassword, adminRepository, hostRepository);
const chatuseCase = new ChatUseCase(repository, repositoryChat, repositoryMessage)

const controller = new userController(useCase, sendMail, cloudinary, generateOtp, chatuseCase)
const admincontroller = new AdminController(admiUseCase);

const router = express.Router();

// user
router.post("/users/login", (req, res) => controller.login(req, res));
router.post("/users/logout", (req, res) => controller.logout(req, res));

// admin
router.post("/admin/login", (req, res) => admincontroller.login(req, res));
router.post("/admin/logout", (req, res) => admincontroller.logout(req, res));

export default router