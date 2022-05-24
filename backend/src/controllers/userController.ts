import { Request, Response, NextFunction } from "express";
import { catchAsync, AppError } from "../lib/error";
import { validMail } from "../lib/validation";
import User from "../models/userModel";
import { sendNotification } from "./socketController";

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

		const alreadyInvited = await User.findOne({
			_id: req.user._id,
			sentInvitation: user._id
		});

		if (alreadyInvited) return next(new AppError("Already Invited!", 409));

		const alreadyFriend = await User.findOne({
			// $and: [{ _id: req.user._id }, { friends: { _id: user._id } }]
			$and: [{ _id: req.user._id }, { "friends._id": user._id }]
		});

		if (alreadyFriend)
			return next(new AppError("You are Already Friends!", 409));

		await User.findByIdAndUpdate(req.user._id, {
			$push: { sentInvitation: user._id }
		});

		await User.findByIdAndUpdate(user._id, {
			$push: { receivedInvitation: req.user._id }
		});

		sendNotification(user._id, req.user);

		res.status(201).json({ status: "success" });
	}
);
