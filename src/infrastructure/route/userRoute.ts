import userController from "../../adapter/userController";
import UserHostController from "../../adapter/userhsotController";
import BookingController from "../../adapter/bookingController";
import WishlistController from "../../adapter/wishlistController";
import userRepository from "../repository/userRepository";
import HostRepository from "../repository/HostRepository";
import AmenityController from "../../adapter/amenitesController";
import CategoryController from "../../adapter/categoryController";
import Userusecase from "../../use_case/userUsecases";
import UserHostUsecase from "../../use_case/userhostUsecase";
import BookingUsecase from "../../use_case/bookingUsecase";
import WishlistUsecase from "../../use_case/wishlistUsecase";
import AmenitiesUsecase from "../../use_case/amenitiesUsecase";
import CategoryUsecase from "../../use_case/categoryUsecase";
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
import BookingRepository from "../repository/bookingRepository";
import wishlistRepository from "../repository/wishlistRepository";
import PaymentRepository from "../repository/paymentRepository";
import AmenityRepository from "../repository/amenityRepository";
import CategoryRepository from "../repository/categoryRepository";



const encrypt = new Encrypt();
const JWTPassword = new jwtPassword();
const sendMail = new nodemailerUtils();
const cloudinary= new CloudinarySetup();
const generateOtp= new GenerateOTP()

const repository= new userRepository();
const repositoryHost= new HostRepository()
const repositoryChat= new conversationRepository()
const repositoryMessage=new MessageRepository()
const repositoryBooking=new BookingRepository()
const repositoryWishlist= new wishlistRepository()
const paymentRepository = new PaymentRepository()
const amenityRepository = new AmenityRepository();
const categoryRepository = new CategoryRepository();

const useCase=new Userusecase(encrypt,repository,JWTPassword)
const hostuseCase= new UserHostUsecase(repositoryHost,cloudinary)
const chatuseCase= new ChatUseCase(repository,repositoryChat,repositoryMessage)
const bookingUsecase = new BookingUsecase(repositoryBooking, paymentRepository)
const wishlistUsecase = new WishlistUsecase(repositoryWishlist)
const amenityUsecase = new AmenitiesUsecase(amenityRepository);
const categoryUsecase = new CategoryUsecase(categoryRepository)

const controller = new userController(useCase, sendMail, cloudinary, generateOtp, chatuseCase)
const hostcontroller= new UserHostController(hostuseCase,chatuseCase)
const bookingcontroller = new BookingController(bookingUsecase)
const whishlistcontroller= new WishlistController(wishlistUsecase)
const amenityController = new AmenityController(amenityUsecase);
const categoryController = new CategoryController(categoryUsecase)

const router=express.Router();

//user
router.post("/", (req, res) => controller.signup(req, res));
router.post("/verify-otp", (req, res) => controller.verifyotp(req,res))
router.post("/resend-otp", (req, res) => controller.resendOtp(req, res))
router.get("/", protect, (req, res) => controller.profile(req, res))
router.patch("/:id", protect, ImageUpload.single('avatar'),(req,res)=>controller.updateProfile(req,res))
router.get('/listings/:id',(req, res) => hostcontroller.roomDetail(req, res))
//user chats
// router.post('/chat', (req, res) => controller.newConversation(req,res))

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


//room booking
router.put('/bookings',(req,res)=>bookingcontroller.newBooking(req,res))
router.get('/bookings',(req,res)=>bookingcontroller.getBookings(req,res))
router.patch('/bookings/:id', (req, res) => bookingcontroller.cancelBooking(req, res))
router.get('/bookings/:id',(req,res)=>bookingcontroller.getBookingdate(req,res))
router.post('/bookings/check-availability', (req, res) => bookingcontroller.checkDateAvailability(req,res))
router.post('/bookings', (req, res) => bookingcontroller.payment(req, res))
router.post('/webhook', (req, res, next) => bookingcontroller.webhook(req, res))

//wishlist
router.put('/wishlist/:id', (req, res) => whishlistcontroller.addTowishlist(req,res))
router.get('/wishlist', (req, res) => whishlistcontroller.userWishlists(req, res))
router.get('/wishlist/:id', (req, res) => whishlistcontroller.checkExisist(req, res))
router.patch('/wishlist/:id', (req, res) => whishlistcontroller.removeWishlist(req, res))

// get amenities and category
router.get('/amenities', (req, res) => amenityController.findAmenity(req, res));
router.get('/category', (req, res) => categoryController.findCategory(req, res));

// get user
router.get("/:id", (req, res) => controller.getUser(req, res))

export default router