import { Request, Response, NextFunction } from "express";
import { catchAsync, AppError } from "../lib/error";
import { validMail } from "../lib/validation";
import User from "../models/userModel";

interface customRequest extends Request {
	user: {
		_id: string;
		username: string;
		email: string;
	};
}

export const invite = catchAsync(
	async (req: customRequest, res: Response, next: NextFunction) => {
		const { invitee } = req.body;

		if (!validMail(invitee))
			return next(new AppError("Email is Invalid!", 401));

		if (invitee.toLowerCase() === req.user.email.toLowerCase())
			return next(new AppError("You can't invite yourself!", 409));

		const user = await User.findOne({ email: invitee.toLowerCase() });

		if (!user) return next(new AppError("User doesn't exist!", 404));

		res.status(200).json({ status: "success" });
	}
);
