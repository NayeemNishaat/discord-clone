import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../lib/error";
import User from "../models/userModel";

interface userSchema {
	username: string;
	password: string;
	confirmPassword: string;
	email: string;
}

export const register = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const newUser: userSchema = await User.create({
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			confirmPassword: req.body.password
		});

		res.status(200).send("Register Route");
	}
);

export const login = (req: Request, res: Response, next: NextFunction) => {
	res.status(200).send("Login Route");
};
