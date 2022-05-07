import { Request, Response, NextFunction } from "express";
import { catchAsync, AppError } from "../lib/error";
import User from "../models/userModel";

interface userSchema {
	username: string;
	password: string | undefined;
	confirmPassword: string | undefined;
	email: string;
	token: string;
}

export const register = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const userExist = await User.findOne({
			email: req.body.email.toLowerCase()
		});

		if (userExist)
			return next(new AppError("Email is already registered!", 409));

		const newUser: userSchema = await User.create({
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			confirmPassword: req.body.password
		});

		const token = "token";

		newUser.token = token;
		newUser.password = undefined;
		newUser.confirmPassword = undefined;

		return res.status(201).json({
			status: "success",
			data: newUser
		});
	}
);

export const login = (req: Request, res: Response, next: NextFunction) => {
	res.status(200).send("Login Route");
};
