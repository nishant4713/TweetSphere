import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile } from "../controllers/usercontroller.js";
import { followUnfollowUser } from "../controllers/usercontroller.js";
import { getSuggestedUsers } from "../controllers/usercontroller.js";
import { updateUser } from "../controllers/usercontroller.js";
const router = express.Router();
router.get("/profile/:username",protectRoute,getUserProfile);
router.get("/suggested",protectRoute,getSuggestedUsers);
router.post("/follow/:id",protectRoute,followUnfollowUser);
router.post("/update",protectRoute,updateUser);
export default router;