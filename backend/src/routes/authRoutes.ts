import express, { Router } from "express";
const router: Router = express.Router();
import {
	register,
	login,
	logout,
	protect,
	secret
} from "../controllers/authController";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/test", protect, secret);

export default router;
