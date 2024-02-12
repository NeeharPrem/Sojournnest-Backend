import AdminUsercases from "../../use_case/adminUsecases";
import AdminRepository from "../repository/adminRepository";
import AdminController from "../../adapter/adminController";
import Encrypt from "../passwordRepository/hashpassword";
import express from "express";
import jwtPassword from "../passwordRepository/jwtpassword";
import { adminProtect } from "../middleware/adminAuth";
import UserRepository from "../repository/userRepository";
import HostRepository from "../repository/HostRepository";
import AmenityRepository from "../repository/amenityRepository";
import AmenitiesUsecase from "../../use_case/amenitiesUsecase";
import AmenityController from "../../adapter/amenitesController";
import CategoryRepository from "../repository/categoryRepository";
import CategoryUsecase from "../../use_case/categoryUsecase";
import CategoryController from "../../adapter/categoryController";


const encrypt = new Encrypt();
const jwtToken = new jwtPassword();

const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const hostRepository= new HostRepository ();
const amenityRepository = new AmenityRepository();
const categoryRepository=new CategoryRepository();

const admiUseCase = new AdminUsercases(encrypt, userRepository, jwtToken, adminRepository, hostRepository);
const amenityUsecase = new AmenitiesUsecase(amenityRepository);
const categoryUsecase=new CategoryUsecase(categoryRepository)
const controller = new AdminController(admiUseCase);
const amenityController = new AmenityController(amenityUsecase);
const categoryController= new CategoryController(categoryUsecase)

const router = express.Router();

// user action routes
router.get("/users",(req,res)=>controller.allUsers(req,res));
router.post("/users/:id",(req,res)=>controller.blockUser(req,res));

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
export default router;
