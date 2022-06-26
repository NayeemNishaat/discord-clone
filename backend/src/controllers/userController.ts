import { Request, Response, NextFunction } from "express";
import { catchAsync, AppError } from "../lib/error";
import { validMail } from "../lib/validation";
import User from "../models/userModel";
import {
	sendInviteNotification,
	sendFriendNotification
} from "./socketController";

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

		// Part: Check if user is already in friends list
		const alreadyInvited = await User.findOne({
			_id: req.user._id,
			sentInvitation: user._id
		});

		if (alreadyInvited) return next(new AppError("Already Invited!", 409));

		// Part: Check if user is already in receivedInvitation list
		const alreadyReceivedInvitation = await User.findOne({
			_id: req.user._id,
			receivedInvitation: user._id
		});

		if (alreadyReceivedInvitation)
			return next(
				new AppError(
					"You have Already Received an Invitation from this User!",
					409
				)
			);

		// Part: Check if already friends
		const alreadyFriend = await User.findOne({
			// $and: [{ _id: req.user._id }, { friends: { _id: user._id } }]
			$and: [{ _id: req.user._id }, { "friends._id": user._id }]
		});

		if (alreadyFriend)
			return next(new AppError("You are Already Friends!", 409));

		// Part: If not friends, send invitation
		req.user = (await User.findByIdAndUpdate(
			req.user._id,
			{
				$push: { sentInvitation: user._id }
			},
			{ new: true }
		)) as customRequest["user"];

		await User.findByIdAndUpdate(user._id, {
			$push: { receivedInvitation: req.user._id }
		});

		// Part: Send notification to receiver
		sendInviteNotification(user._id, req.user);

		res.status(201).json({ status: "success" });
	}
);

export const createGroup = catchAsync(
	async (req: customRequest, res: Response, next: NextFunction) => {
		const { groupName } = req.body;
		console.log(groupName);

		res.status(200).json({
			status: "success"
		});
	}
);

export const accept = catchAsync(
	async (req: customRequest, res: Response, next: NextFunction) => {
		const { id } = req.body;

		// Part: Making the users friends and removing the invitation
		const receiver = await User.findByIdAndUpdate(
			req.user._id,
			{
				$pull: { receivedInvitation: id },
				$push: { friends: id }
			},
			{ new: true, populate: "friends" }
		).lean();
		const sender = await User.findByIdAndUpdate(
			id,
			{
				$pull: { sentInvitation: req.user._id },
				$push: { friends: req.user._id }
			},
			{ new: true, populate: "friends" }
		).lean();

		// Part: Update the users friends list dynamically
		sendFriendNotification(sender, receiver);

		res.status(200).json({ status: "success" });
	}
);

export const reject = catchAsync(
	async (req: customRequest, res: Response, next: NextFunction) => {
		const { id } = req.body;

		// Part: Removing the invitation from both users
		await User.findByIdAndUpdate(req.user._id, {
			$pull: { receivedInvitation: id }
		});
		await User.findByIdAndUpdate(id, {
			$pull: { sentInvitation: req.user._id }
		});

		res.status(200).json({ status: "success" });
	}
);
