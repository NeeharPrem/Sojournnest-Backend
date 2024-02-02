import AdminUsercases from "../../use_case/adminUsecases";
import AdminRepository from "../repository/adminRepository";
import AdminController from "../../adapter/adminController";
import Encrypt from "../passwordRepository/hashpassword";
import express from "express";
import jwtPassword from "../passwordRepository/jwtpassword";
import { adminProtect } from "../middleware/adminAuth";
import UserRepository from "../repository/userRepository";
import HostRepository from "../repository/HostRepository";

const encrypt = new Encrypt();
const jwtToken = new jwtPassword();

const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const hostRepository= new HostRepository ()

const admiUseCase = new AdminUsercases(encrypt, userRepository, jwtToken, adminRepository, hostRepository);

const controller = new AdminController(admiUseCase);

const router = express.Router();

// user action routes
router.get("/users",(req,res)=>controller.allUsers(req,res))
router.post("/users/:id",(req,res)=>controller.blockUser(req,res))

//Listing action routes
router.get("/listings", (req, res) => controller.allListings(req,res))
router.post('/listings/:id', (req, res) => controller.approveListing(req, res))
router.patch('/listings/:id',(req,res)=>controller.blocListing(req,res))
export default router;
