import express, { Router } from "express";
const router: Router = express.Router();
import {
	invite,
	createGroup,
	accept,
	reject
} from "../controllers/userController";
import { protect } from "../controllers/authController";

router.post("/invite", protect, invite);
router.post("/create-group", protect, createGroup);
router.patch("/accept", protect, accept);
router.patch("/reject", protect, reject);

export default router;
