import { Request, Response, NextFunction } from "express";
import { catchAsync, AppError } from "../lib/error";
import { validMail } from "../lib/validation";
import User from "../models/userModel";
import GroupConversation from "../models/groupConversationModel";
import {
	sendInviteNotification,
	sendFriendNotification,
	sendGroupNotification
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
		const { invitee, groupId, groupName } = req.body;

		if (!validMail(invitee))
			return next(new AppError("Email is Invalid!", 401));

		if (invitee.toLowerCase() === req.user.email.toLowerCase())
			return next(new AppError("You can't invite yourself!", 409));

		const user = await User.findOne({ email: invitee.toLowerCase() });

		if (!user) return next(new AppError("User doesn't exist!", 404));

		// Part: Check if user is already invited
		const alreadyInvited = await User.findOne({
			_id: req.user._id,
			"sentInvitation.user": user._id
		});

		if (alreadyInvited) return next(new AppError("Already Invited!", 409));

		if (groupId) {
			const alreadyInvited = await User.findOne({
				_id: req.user._id,
				"sentInvitation.user": user._id,
				"sentInvitation.groupId": groupId
			});
			if (alreadyInvited)
				return next(new AppError("Already Invited!", 409));
		}

		// Part: Check if user is already in receivedInvitation list
		if (!groupId) {
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
		}

		// Part: Check if already friends
		const alreadyFriend = await User.findOne({
			_id: req.user._id,
			friends: user._id
		});

		if (groupId) {
			if (!alreadyFriend)
				return next(
					new AppError("You can only invite your friends!", 409)
				);

			// Part: Check if already in group
			const alreadyInGroup = await GroupConversation.findOne({
				_id: groupId,
				"members._id": user._id
			});

			if (alreadyInGroup)
				return next(new AppError("User already in group!", 409));
		}

		if (!groupId && alreadyFriend) {
			return next(new AppError("You are Already Friends!", 409));
		}

		// Part: Send invitation
		req.user = (await User.findByIdAndUpdate(
			req.user._id,
			{
				$push: {
					sentInvitation: {
						user: user._id,
						groupId: groupId ? groupId : null
					}
				}
			},
			{ new: true }
		)) as customRequest["user"];

		await User.findByIdAndUpdate(user._id, {
			$push: {
				receivedInvitation: {
					user: req.user._id,
					groupId: groupId ? groupId : null,
					groupName: groupName ? groupName : null
				}
			}
		});

		// Part: Send notification to receiver
		sendInviteNotification(user._id, req.user, groupId, groupName);

		res.status(201).json({ status: "success" });
	}
);

export const createGroup = catchAsync(
	async (req: customRequest, res: Response, next: NextFunction) => {
		const { groupName } = req.body;

		const group = await GroupConversation.create({
			name: groupName,
			owner: req.user._id,
			members: [req.user._id],
			messages: []
		});

		await User.findByIdAndUpdate(req.user._id, {
			$push: { groups: group._id }
		});

		sendGroupNotification(req.user._id);

		res.status(201).json({ status: "success" });
	}
);

export const accept = catchAsync(
	async (req: customRequest, res: Response, next: NextFunction) => {
		const { id, groupId } = req.body;

		// Part: Making the users friends and removing the invitation
		if (groupId) {
			await GroupConversation.findByIdAndUpdate(groupId, {
				$push: { members: req.user._id }
			});

			await User.findByIdAndUpdate(req.user._id, {
				$push: { groups: groupId }
			});

			await User.findByIdAndUpdate(req.user._id, {
				$pull: { receivedInvitation: { user: id } }
			});

			await User.findByIdAndUpdate(id, {
				$pull: { sentInvitation: { user: req.user._id } }
			});

			sendGroupNotification(req.user._id, undefined, groupId);
		} else {
			const receiver = await User.findOneAndUpdate(
				{ _id: req.user._id },
				{
					$pull: { receivedInvitation: { user: id } },
					$push: { friends: id }
				},
				{
					new: true,
					populate: "friends"
				}
			).lean();

			const sender = await User.findOneAndUpdate(
				{ _id: id },
				{
					$pull: { sentInvitation: { user: req.user._id } },
					$push: { friends: req.user._id }
				},
				{ new: true, populate: "friends" }
			).lean();

			sendFriendNotification(sender, receiver);
		}

		res.status(200).json({ status: "success" });
	}
);

export const reject = catchAsync(
	async (req: customRequest, res: Response, next: NextFunction) => {
		const { id } = req.body;

		// Part: Removing the invitation from both users
		await User.findByIdAndUpdate(req.user._id, {
			$pull: { receivedInvitation: { user: id } }
		});
		await User.findByIdAndUpdate(id, {
			$pull: { sentInvitation: { user: req.user._id } }
		});

		res.status(200).json({ status: "success" });
	}
);
