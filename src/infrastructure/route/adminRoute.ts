import AmenityController from "../../adapter/amenitesController";
import AdminController from "../../adapter/adminController";
import BookingController from "../../adapter/bookingController";
import CategoryController from "../../adapter/categoryController";
import AdminUsercases from "../../use_case/adminUsecases";
import AmenitiesUsecase from "../../use_case/amenitiesUsecase";
import BookingUsecase from "../../use_case/bookingUsecase";
import CategoryUsecase from "../../use_case/categoryUsecase";
import AdminRepository from "../repository/adminRepository";
import AmenityRepository from "../repository/amenityRepository";
import BookingRepository from "../repository/bookingRepository";
import CategoryRepository from "../repository/categoryRepository";
import HostRepository from "../repository/HostRepository";
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
const userRepository = new UserRepository();

const admiUseCase = new AdminUsercases(encrypt, userRepository, jwtToken, adminRepository, hostRepository);
const amenityUsecase = new AmenitiesUsecase(amenityRepository);
const categoryUsecase=new CategoryUsecase(categoryRepository)
const bookingUsecase = new BookingUsecase(bookingRepository, paymentRepository)
const controller = new AdminController(admiUseCase);
const amenityController = new AmenityController(amenityUsecase);
const categoryController= new CategoryController(categoryUsecase)
const bookingController = new BookingController(bookingUsecase)

const router = express.Router();

// user action routes
router.get("/users",(req,res)=>controller.allUsers(req,res));
router.post("/users/:id",(req,res)=>controller.blockUser(req,res));
router.patch("/users/:id", (req, res) => controller.approveUser(req, res));

//Listing action routes
router.get("/listings", (req, res) => controller.allListings(req,res));
router.post('/listings/:id', (req, res) => controller.approveListing(req, res));
router.patch('/listings/:id',(req,res)=>controller.blocListing(req,res));
// amenites
router.get('/amenities', (req, res) => amenityController.findAmenity(req, res));
router.put('/amenities', (req, res) => amenityController.newEntry(req, res));
router.post('/amenities',(req,res)=>amenityController.editEntry(req,res))
router.patch("/amenities",(req,res)=>amenityController.deleteEntry(req,res))
//category
router.get('/category', (req, res) => categoryController.findCategory(req, res));
router.put('/category', (req, res) => categoryController.newEntry(req, res));
router.patch("/category", (req, res) => categoryController.deleteEntry(req, res))
router.post("/category", (req, res) => categoryController.editEntry(req, res))

// bookings
router.get('/bookings',(req,res)=>bookingController.allbookings(req,res))
export default router;
