import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { catchAsync, AppError } from "../lib/error";
import User from "../models/userModel";
import { validMail } from "../lib/validation";

interface customRequest extends Request {
	user: {
		_id: string;
		username: string;
		email: string;
	};
}
interface userSchema {
	_id: string;
	username: string;
	password: string | undefined;
	confirmPassword: string | undefined;
	email: string;
	token: string;
}
interface JwtPayload {
	id: string;
	email: string;
}

declare const process: {
	env: {
		JWT_SECRET: string;
		JWT_EXPIRES_IN: string;
		JWT_COOKIE_EXPIRES_IN: number;
	};
};

const createSendToken = (
	user: userSchema,
	statusCode: number,
	req: Request,
	res: Response
) => {
	const token = jwt.sign(
		{ id: user._id, email: user.email },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRES_IN
		}
	);

	const cookieOptions = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1), // Note: Must be number!
		httpOnly: true,
		secure: req.secure // Important: req.secure is false in localhost. If it is true it won't be available via document.cookie but in http header!
	};

	res.cookie("jwt", token, cookieOptions);
	user.password = undefined;

	res.status(statusCode).json({ status: "success", data: user });
};

export const register = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		if (!validMail(req.body.email))
			return next(new AppError("Email is Invalid!", 401));

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

		createSendToken(newUser, 201, req, res);
	}
);

export const login = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		if (!validMail(req.body.email))
			return next(new AppError("Email is Invalid!", 401));

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

		createSendToken(user, 200, req, res);
	}
);

export const logout = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		res.cookie("jwt", "loggedout", {
			expires: new Date(Date.now() + 100),
			httpOnly: true
		});

		res.status(200).json({ status: "success" });
	}
);

export const protect = catchAsync(
	async (req: customRequest, res: Response, next: NextFunction) => {
		let token;
		if (req.headers.cookie) {
			req.headers.cookie.split("; ").forEach((el) => {
				const arr = el.split("=");
				if (arr[0] === "jwt") token = arr[1];
			});
		}

		if (!token)
			return next(new AppError("Please log in to get access!", 401));

		const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload; // Warning: Overwriting the default JwtPayload interface with our JwtPayload interface!

		const currentUser = await User.findById(decoded.id);

		if (!currentUser)
			return next(
				new AppError(
					"The user belonging to this token does no longer exist.",
					401
				)
			);

		// Point: Check if the user changed the password after the token was issued is not implemented because we are not providing the password changing functionality here!

		req.user = currentUser;
		next();
	}
);

export const checkLogin = catchAsync(
	async (req: customRequest, res: Response, next: NextFunction) => {
		res.status(200).json({
			status: "success",
			message: "You are logged in!"
		});
	}
);
