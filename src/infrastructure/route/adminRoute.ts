import AdminUsercases from "../../use_case/adminUsecases";
import AdminRepository from "../repository/adminRepository";
import AdminController from "../../adapter/adminController";
import Encrypt from "../passwordRepository/hashpassword";
import express from "express";
import jwtPassword from "../passwordRepository/jwtpassword";
import { adminProtect } from "../middleware/adminAuth";
import UserRepository from "../repository/userRepository";

const encrypt = new Encrypt();
const jwtToken = new jwtPassword();

const adminRepository = new AdminRepository();
const userRepository = new UserRepository();

const admiUseCase = new AdminUsercases(encrypt, userRepository,jwtToken,adminRepository);

const controller = new AdminController(admiUseCase);

const router = express.Router();

// Define your routes here
router.post("/login", (req, res) => controller.login(req, res));
router.get("/users",(req,res)=>controller.allUsers(req,res))
// router.post("/logout", adminProtect, (req, res) => controller.logout(req, res));
export default router;
