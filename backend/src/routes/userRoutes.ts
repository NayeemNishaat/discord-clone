import express, { Router } from "express";
const router: Router = express.Router();
import { invite } from "../controllers/userController";
import { protect } from "../controllers/authController";

router.post("/invite", protect, invite);

export default router;
