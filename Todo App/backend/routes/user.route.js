import { Router } from "express";
import {
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.delete("/logout", logoutUser);

export default router;
