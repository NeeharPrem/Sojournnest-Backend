import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import user from "../route/userRoute";
import admin from "../route/adminRoute"
// import session from "express-session";
import http from "http";
import path from 'path'


const createServer = () => {
  try {
    const app = express();
    
    app.use(cors({ origin:'http://localhost:5000', credentials: true }));

    app.use(express.json());
    // app.use(
    //   session({
    //     secret: "your-secret-key",
    //     resave: false,
    //     saveUninitialized: true,
    //   })
    // );
    app.use(express.static(path.join(__dirname, '../public')));

    app.use(cookieParser());
    app.options("*", cors());
    app.use("/api/user", user);
    app.use("/api/admin", admin);

    const server = http.createServer(app);
    initializeSocket(server);

    return server;
  } catch (error) {
    console.error("Error creating server:", error);
    throw error;
  }
};
const initializeSocket = (server: http.Server) => {

};

export { createServer };
