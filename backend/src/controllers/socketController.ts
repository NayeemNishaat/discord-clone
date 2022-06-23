import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import Conversation from "../models/conversationModel";
import { getIoInstance } from "../socketEvents";

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

interface friends {
	_id: string;
	socketId?: string;
	usename: string;
	isOnline: boolean;
}

let token: string;
export const verifyUser = async (
	socket: Socket,
	next: { (err?: ExtendedError | undefined): void }
) => {
	if (socket.handshake.headers.cookie) {
		socket.handshake.headers.cookie.split("; ").forEach((el: string) => {
			const arr = el.split("=");
			if (arr[0] === "jwt") token = arr[1];
		});
	}

	if (!token) return socket.emit("error", "Please log in to get access!");

	let decoded: { id: string; email: string };
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
	} catch (err) {
		return socket.emit("error", "Invalid Token!");
	}

	const currentUser = await User.findById(decoded.id);

	if (!currentUser)
		return socket.emit(
			"error",
			"The user belonging to this token does no longer exist."
		);

	socket.data = currentUser;
	next();
};

const users = new Map();
let userInfo: {
	friends: friends[];
	receivedInvitation: {}[];
};

const getSocketId = (id: string) => {
	return [...users].find(
		([_key, value]: [string, string]) => value === id
	)?.[0] as string;
};

const getOnlineFriends = (friends: friends[]) => {
	return friends.map((friend) => {
		if (Array.from(users.values()).includes(friend._id.toString())) {
			friend.isOnline = true;
			friend.socketId = getSocketId(friend._id.toString());
			return friend;
		}
		friend.isOnline = false;
		return friend;
	});
};

const updateOnlineFriends = async (userId: string, active: boolean = true) => {
	const io = getIoInstance();

	const user = await User.findById(userId, "friends")
		.populate("friends", "username")
		.lean();

	const friendsStat = getOnlineFriends(user.friends);

	friendsStat.forEach((friend) => {
		if (friend.isOnline === true) {
			return io.to(friend.socketId as string).emit("friendOnline", {
				_id: user._id,
				usename: user.username,
				isOnline: active
			});
		}
	});
};

export const sendInviteNotification = (
	receiver: string,
	sender: {
		_id: string;
		username: string;
		email: string;
	}
) => {
	const io = getIoInstance();

	let activeUserIds: string[] = []; // Important: Array because a user could be connected from multiple devices!

	users.forEach((value, key) => {
		if (value === receiver.toString()) activeUserIds.push(key); // Note: Finding active receiver's SocketId!
	});
	activeUserIds.forEach((activeUserId) => {
		io.to(activeUserId).emit("invite", [
			...userInfo.receivedInvitation,
			{
				_id: sender._id,
				username: sender.username
			}
		]);
	});
};

export const sendFriendNotification = (
	sender: {
		_id: string;
		friends: friends[];
	},
	receiver: {
		_id: string;
		friends: friends[];
	}
) => {
	const io = getIoInstance();

	users.forEach((value, key) => {
		if (value === receiver._id.toString()) {
			const receiverFriends = getOnlineFriends(receiver.friends);
			io.to(key).emit("friend", receiverFriends);
		}

		if (value === sender._id.toString()) {
			const senderFriends = getOnlineFriends(sender.friends);
			io.to(key).emit("friend", senderFriends);
		}
	});
};

const getPrivateHistory = async (socket: Socket, friendId: string) => {
	const conversation = await Conversation.findOne({
		participents: { $all: [socket.data._id, friendId] }
	}).populate({
		path: "messages",
		populate: { path: "author", select: "username" }
	});

	if (!conversation) return socket.emit("privateHistory", null);

	return socket.emit("privateHistory", conversation.messages);
};

const handlePrivateMessage = async (
	socket: Socket,
	data: { to: string; message: string }
) => {
	const io = getIoInstance();
	const senderId = socket.data._id;
	const receiverId = data.to;

	const conversation = await Conversation.findOne({
		participents: { $all: [senderId, receiverId] }
	});

	if (conversation) {
		await Conversation.updateOne(
			{
				_id: conversation._id
			},
			{
				$push: {
					messages: {
						author: senderId,
						message: data.message,
						date: new Date(),
						type: "private"
					}
				}
			}
		);
	} else {
		Conversation.create({
			participents: [senderId, receiverId],
			messages: [
				{
					author: senderId,
					message: data.message,
					date: new Date(),
					type: "private"
				}
			]
		});
	}

	[senderId, receiverId].forEach((id) => {
		const activeUser = getSocketId(id.toString());

		activeUser &&
			io.to(activeUser).emit("private", {
				author: { username: socket.data.username },
				message: data.message,
				date: new Date(),
				type: "private"
			});
	});
};

export const connectedUsers = async (socket: Socket) => {
	if (!Array.from(users.values()).includes(socket.data._id.toString()))
		users.set(socket.id, socket.data._id.toString());

	userInfo = await User.findById(
		socket.data._id,
		"receivedInvitation friends"
	)
		.populate("receivedInvitation", "username")
		.populate("friends", "username")
		.lean();

	const friends = getOnlineFriends(userInfo.friends);

	socket.emit("friend", friends);
	socket.emit("invite", userInfo.receivedInvitation);

	updateOnlineFriends(socket.data._id);

	socket.on("privateHistory", async (friendId: string) => {
		getPrivateHistory(socket, friendId);
	});

	socket.on("private", (data) => {
		handlePrivateMessage(socket, data);
	});

	socket.on("disconnect", () => {
		users.delete(socket.id);
		updateOnlineFriends(socket.data._id, false);
	});
};
