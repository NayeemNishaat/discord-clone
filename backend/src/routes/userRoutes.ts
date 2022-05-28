import express, { Router } from "express";
const router: Router = express.Router();
import { invite, accept } from "../controllers/userController";
import { protect } from "../controllers/authController";

router.post("/invite", protect, invite);
router.patch("/accept", protect, accept);

export default router;
