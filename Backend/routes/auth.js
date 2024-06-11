import express from "express";
import {signup,login,logout} from "../controllers/authcontroller.js";
import {protectRoute} from "../middleware/protectRoute.js"
import { getMe } from "../controllers/authcontroller.js";
const router = express.Router();
router.get("/me",protectRoute,getMe);
router.post("/signup",signup)
router.post("/login",login);
router.post("/logout",logout);
export default router;