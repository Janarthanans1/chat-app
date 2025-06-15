import express from "express";
import {
  check,
  logOut,
  signIn,
  signUp,
  updateProfile,
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/logout", logOut);
router.put("/upadate-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, check);

export default router;
