import userController from "../../adapter/userController";
import UserHostController from "../../adapter/userhsotController";
import BookingController from "../../adapter/bookingController";
import WishlistController from "../../adapter/wishlistController";
import reviewController from "../../adapter/reviewController";
import AmenityController from "../../adapter/amenitesController";
import CategoryController from "../../adapter/categoryController";
import reviewUsercase from "../../use_case/reviewUsecases";
import Userusecase from "../../use_case/userUsecases";
import UserHostUsecase from "../../use_case/userhostUsecase";
import BookingUsecase from "../../use_case/bookingUsecase";
import WishlistUsecase from "../../use_case/wishlistUsecase";
import AmenitiesUsecase from "../../use_case/amenitiesUsecase";
import CategoryUsecase from "../../use_case/categoryUsecase";
import paymentUsecase from "../../use_case/paymentUsecase";
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
import userRepository from "../repository/userRepository";
import HostRepository from "../repository/HostRepository";
import reviewRepository from "../repository/reviewRepository";
import hostreviewRepository from "../repository/hostreviewRepository";
import paymensettingRepository from "../repository/paymensettingRepository";



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
const reviewrepository = new reviewRepository();
const hostreviewrepository = new hostreviewRepository()
const paymensettingrepository = new paymensettingRepository()

const useCase=new Userusecase(encrypt,repository,JWTPassword)
const hostuseCase= new UserHostUsecase(repositoryHost,cloudinary)
const chatuseCase= new ChatUseCase(repository,repositoryChat,repositoryMessage)
const bookingUsecase = new BookingUsecase(repositoryBooking, paymentRepository,paymensettingrepository)
const wishlistUsecase = new WishlistUsecase(repositoryWishlist)
const amenityUsecase = new AmenitiesUsecase(amenityRepository);
const categoryUsecase = new CategoryUsecase(categoryRepository);
const paymentusecase = new paymentUsecase(paymensettingrepository)
const reviewUsecases = new reviewUsercase(reviewrepository, repositoryBooking,hostreviewrepository);

const controller = new userController(useCase, sendMail, cloudinary, generateOtp, chatuseCase)
const hostcontroller = new UserHostController(hostuseCase, chatuseCase, paymentusecase)
const bookingcontroller = new BookingController(bookingUsecase)
const whishlistcontroller= new WishlistController(wishlistUsecase)
const amenityController = new AmenityController(amenityUsecase);
const categoryController = new CategoryController(categoryUsecase)
const reviewcontroller = new reviewController(reviewUsecases)

const router=express.Router();

//user
router.post("/", (req, res) => controller.signup(req, res));
router.post("/verify-otp", (req, res) => controller.verifyotp(req,res))
router.post("/resend-otp", (req, res) => controller.resendOtp(req, res))
router.get("/",(req, res) => controller.profile(req, res))
router.patch("/:id", protect, ImageUpload.single('avatar'),(req,res)=>controller.updateProfile(req,res))
router.put("/:id",ImageUpload.single('verifyId'), (req, res) => controller.uploadId(req, res))
router.get('/listings/:id',(req, res) => hostcontroller.roomDetail(req, res))
//user chats
// router.post('/chat', (req, res) => controller.newConversation(req,res))

// host 
router.get('/host/listings', (req,res)=>hostcontroller.getListings(req,res))
router.put('/host/listings', ImageUpload.array('images'),(req,res)=>hostcontroller.addRoom(req,res))
router.get('/host/listings/:id', (req, res) => hostcontroller.roomData(req, res))
router.patch('/host/listings/:id', (req,res)=>hostcontroller.unlist(req,res))
router.put('/host/listings/:id', ImageUpload.array('images'), (req, res) => hostcontroller.roomDataUpdate(req, res))

// getting the listing data
router.get('/listings', (req, res) => hostcontroller.allListings(req, res));

// host chat
router.post('/host/chat',(req, res) => hostcontroller.newConversation(req, res))
router.get('/host/chat/:id',(req, res) => hostcontroller.getConversations(req, res))
router.post('/host/chat/messages',(req,res)=>hostcontroller.addMessage(req,res))
router.get('/host/chat/messages/:id',(req,res)=>hostcontroller.getMessages(req,res))


//room booking
router.put('/bookings',(req,res)=>bookingcontroller.newBooking(req,res))
router.get('/bookings',(req,res)=>bookingcontroller.getBookings(req,res))
router.get('/bookings/cancelled', (req, res) => bookingcontroller.canceledBookings(req, res))
router.patch('/bookings/:id',(req, res) => bookingcontroller.cancelBooking(req, res))
router.get('/bookings/:id',(req,res)=>bookingcontroller.getBookingdate(req,res))
router.post('/bookings/check-availability', (req, res) => bookingcontroller.checkDateAvailability(req,res))
router.post('/bookings',(req, res) => bookingcontroller.payment(req, res))
router.post('/webhook', (req, res) => bookingcontroller.webhook(req, res))

//host managing booking
router.get('/host/bookings',(req,res)=>bookingcontroller.upBookings(req,res))
router.patch('/host/bookings/:id', (req, res) => bookingcontroller.hostCancelBookings(req, res))

//room Date blocking
router.put('/host/managedate/:id',(req,res) => hostcontroller.blockDate(req,res))
router.get('/host/managedate/:id', (req,res)=>hostcontroller.blockedDates(req,res))
router.patch('/host/managedate/:id',(req,res)=>hostcontroller.removeDate(req,res))

//wishlist
router.put('/wishlist/:id', (req, res) => whishlistcontroller.addTowishlist(req,res))
router.get('/wishlist',(req, res) => whishlistcontroller.userWishlists(req, res))
router.get('/wishlist/:id', (req, res) => whishlistcontroller.checkExisist(req, res))
router.patch('/wishlist/:id', (req, res) => whishlistcontroller.removeWishlist(req, res))

// get amenities and category
router.get('/amenities', (req, res) => amenityController.findAmenity(req, res));
router.get('/category', (req, res) => categoryController.findCategory(req, res));

//rating
router.post('/rating/:id', (req, res) => reviewcontroller.addReview(req,res))
router.patch('/rating/:id', (req, res) => reviewcontroller.roomReviewEdit(req,res))
router.get('/rating/:id',(req,res)=>reviewcontroller.getRoomReviews(req,res))
router.get('/rating',(req,res)=>reviewcontroller.bookingAndreview(req,res))

// host review
router.get('/host/rating', (req, res) => reviewcontroller.hostReviewcheck(req, res))
router.post('/host/rating/:id', (req, res) => reviewcontroller.postHostreview(req, res))
router.patch('/host/rating/:id', (req, res) => reviewcontroller.HostReviewEdit(req, res))
router.get('/host/rating/:id', (req, res) => reviewcontroller.getHostReviews(req, res))

//hostdashboard
router.get('/host/hostdashboard', (req, res) => bookingcontroller.dashboard(req,res))

// get user
router.get("/:id", (req, res) => controller.getUser(req, res))

export default router