import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "../route/userRoute";
import adminRouter from "../route/adminRoute";
import authRouter from "../route/authRouter"; 
import http from "http";
import path from 'path'
const morgan = require('morgan')
import initializeSocket from "./socketServer";
import { setupCronJobs } from './scheduler';


const createServer = () => {
  try {
    const app = express();
    
    app.use(cors({ origin:'http://localhost:5000', credentials: true }));
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../public')));

    setupCronJobs()
    app.use(cookieParser());
    app.options("*", cors());
    app.use("/api/users", userRouter);
    app.use("/api/admins", adminRouter);
    app.use('/api/auth',authRouter)

    const server = http.createServer(app);
    initializeSocket(server);

    return server;
  } catch (error) {
    console.error("Error creating server:", error);
    throw error;
  }
};
export { createServer };
