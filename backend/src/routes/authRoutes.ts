import express, { Router } from "express";
const router: Router = express.Router();
import {
	register,
	login,
	logout,
	protect,
	checkLogin
} from "../controllers/authController";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/check-login", protect, checkLogin);

export default router;
