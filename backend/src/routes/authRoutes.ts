import express, { Router, Request, Response, NextFunction } from "express";

const router: Router = express.Router();

router.post("/register", (req: Request, res: Response, next: NextFunction) => {
	console.log(55);
	res.status(200).send("Register Route");
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
	res.status(200).send("Login Route");
});

export default router;
