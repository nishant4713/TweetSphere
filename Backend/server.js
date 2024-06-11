import express from "express";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cloudinary from "cloudinary";
import path from "path";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user-routes.js";
import postRoutes from "./routes/post-routes.js";
import notificationRoutes from "./routes/notification-routes.js"

import {connectMongoDB} from "./db/connectMongoDB.js";

const app = express();
const __dirname = path.resolve();
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
app.use(cors());
app.use(express.json({limit:"5mb"}));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use("/api/auth",authRoutes);  
app.use("/api/users",userRoutes);  
app.use("/api/posts",postRoutes);
app.use("/api/notifications",notificationRoutes);
 
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"/Frontend/dist")));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
    })
}
app.listen(8000,()=>{
    console.log("Server is running ");
    connectMongoDB();
})
