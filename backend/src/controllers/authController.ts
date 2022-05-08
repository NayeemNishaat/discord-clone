import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { catchAsync, AppError } from "../lib/error";
import User from "../models/userModel";

interface userSchema {
	_id: string;
	username: string;
	password: string | undefined;
	confirmPassword: string | undefined;
	email: string;
	token: string;
}
declare const process: {
	env: {
		JWT_SECRET: string;
		JWT_EXPIRES_IN: string;
		JWT_COOKIE_EXPIRES_IN: number;
	};
};

const createSendToken = (
	info: { id: string; email: string },
	req: Request,
	res: Response
) => {
	const token = jwt.sign(info, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN
	});

	const cookieOptions = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1), // Note: Must be number!
		httpOnly: true,
		secure: true
	};

	res.cookie("jwt", token, cookieOptions);
};

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

		createSendToken({ id: newUser._id, email: newUser.email }, req, res);

		newUser.password = undefined;

		res.status(201).json({ status: "success", data: newUser });
	}
);

export const login = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const user: userSchema = await User.findOne({
			email: req.body.email.toLowerCase()
		}).select("+password");

		if (!user) return next(new AppError("Invalid credentials!", 400));

		if (
			user.password &&
			!(await bcrypt.compare(req.body.password, user.password))
		) {
			return next(new AppError("Invalid credentials!", 400));
		}

		createSendToken({ id: user._id, email: user.email }, req, res);

		user.password = undefined;

		res.status(200).json({ status: "success", data: user });
	}
);
