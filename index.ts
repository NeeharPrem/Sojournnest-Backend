import { createServer } from "./src/infrastructure/config/app";
import { connectDB } from "./src/infrastructure/config/connectDB";


const app=createServer();


connectDB().then(()=>{
    app?.listen(3000,()=>{
        console.log("connected to the server")
    })
})