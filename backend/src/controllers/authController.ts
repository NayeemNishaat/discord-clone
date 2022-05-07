import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
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
			confirmPassword: req.body.confirmPassword
		});

		newUser.token = "token";
		newUser.password = undefined;

		res.status(201).json({ status: "success", data: newUser });
	}
);

export const login = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await User.findOne({
			email: req.body.email.toLowerCase()
		});

		if (!user) return next(new AppError("Invalid credentials!", 400));

		if (await bcrypt.compare(req.body.password, user.password)) {
			user.token = "Token";
		}

		res.status(200).json({ status: "success", data: user });
	}
);
