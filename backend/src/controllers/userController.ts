import { Request, Response, NextFunction } from "express";
import { catchAsync, AppError } from "../lib/error";
import { validMail } from "../lib/validation";

export const invite = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { invitee } = req.body;

		if (!validMail(invitee))
			return next(new AppError("Email is Invalid!", 401));

		console.log(invitee);

		res.status(200).json({ status: "success" });
	}
);
