import AmenityController from "../../adapter/amenitesController";
import AdminController from "../../adapter/adminController";
import BookingController from "../../adapter/bookingController";
import CategoryController from "../../adapter/categoryController";
import paymentController from "../../adapter/paymentController";
import AdminUsercases from "../../use_case/adminUsecases";
import AmenitiesUsecase from "../../use_case/amenitiesUsecase";
import BookingUsecase from "../../use_case/bookingUsecase";
import CategoryUsecase from "../../use_case/categoryUsecase";
import paymentUsecase from "../../use_case/paymentUsecase";
import AdminRepository from "../repository/adminRepository";
import AmenityRepository from "../repository/amenityRepository";
import BookingRepository from "../repository/bookingRepository";
import CategoryRepository from "../repository/categoryRepository";
import HostRepository from "../repository/HostRepository";
import paymensettingRepository from "../repository/paymensettingRepository";
import UserRepository from "../repository/userRepository";
import Encrypt from "../passwordRepository/hashpassword";
import express from "express";
import jwtPassword from "../passwordRepository/jwtpassword";
import PaymentRepository from "../repository/paymentRepository";
import { adminProtect } from "../middleware/adminAuth";


const encrypt = new Encrypt();
const jwtToken = new jwtPassword();

const adminRepository = new AdminRepository();
const amenityRepository = new AmenityRepository();
const bookingRepository= new BookingRepository()
const categoryRepository=new CategoryRepository();
const hostRepository= new HostRepository ();
const paymentRepository= new PaymentRepository();
const paymensettingrepository = new paymensettingRepository()
const userRepository = new UserRepository();

const admiUseCase = new AdminUsercases(encrypt, userRepository, jwtToken, adminRepository, hostRepository);
const amenityUsecase = new AmenitiesUsecase(amenityRepository);
const bookingUsecase = new BookingUsecase(bookingRepository, paymentRepository, paymensettingrepository)
const categoryUsecase=new CategoryUsecase(categoryRepository)
const paymentusecase = new paymentUsecase(paymensettingrepository);

const controller = new AdminController(admiUseCase);
const amenityController = new AmenityController(amenityUsecase);
const categoryController= new CategoryController(categoryUsecase)
const bookingController = new BookingController(bookingUsecase)
const paymentcontroller = new paymentController(paymentusecase)

const router = express.Router();

// user action routes
router.get("/users", adminProtect,(req,res)=>controller.allUsers(req,res));
router.post("/users/:id", adminProtect,(req,res)=>controller.blockUser(req,res));
router.patch("/users/:id", adminProtect,(req, res) => controller.approveUser(req, res));

//Listing action routes
router.get("/listings", adminProtect,(req, res) => controller.allListings(req,res));
router.post('/listings/:id', adminProtect,(req, res) => controller.approveListing(req, res));
router.patch('/listings/:id', adminProtect,(req,res)=>controller.blocListing(req,res));
// amenites
router.get('/amenities', adminProtect,(req, res) => amenityController.findAmenity(req, res));
router.put('/amenities', adminProtect,(req, res) => amenityController.newEntry(req, res));
router.post('/amenities', adminProtect,(req,res)=>amenityController.editEntry(req,res))
router.patch("/amenities", adminProtect,(req,res)=>amenityController.deleteEntry(req,res))
//category
router.get('/category', adminProtect,(req, res) => categoryController.findCategory(req, res));
router.put('/category', adminProtect,(req, res) => categoryController.newEntry(req, res));
router.patch("/category", adminProtect,(req, res) => categoryController.deleteEntry(req, res))
router.post("/category", adminProtect,(req, res) => categoryController.editEntry(req, res))

// admin dashboard
router.get('/adminDashboard', adminProtect,(req, res) => bookingController.adminDashboard(req,res))

// bookings
router.get('/bookings', adminProtect,(req,res)=>bookingController.allbookings(req,res))

//payment setting
router.post('/payments', adminProtect,(req,res) => paymentcontroller.addServiceFee(req,res))
export default router;