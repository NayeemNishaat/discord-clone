import express, { Router } from "express";
const router: Router = express.Router();
import { invite } from "../controllers/userController";

router.post("/invite", invite);

export default router;
