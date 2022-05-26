import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
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
		return socket.emit("error", "Inva;id Token!");
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
export const connectedUsers = async (socket: Socket) => {
	const receivedInvitations = await User.findById(
		socket.data._id,
		"receivedInvitation"
	).populate("receivedInvitation", "username");

	socket.emit("invite", receivedInvitations.receivedInvitation);

	if (!Array.from(users.values()).includes(socket.data._id.toString()))
		users.set(socket.id, socket.data._id.toString());

	socket.on("disconnect", () => {
		users.delete(socket.id);
		console.log("removeUser", users);
	});

	console.log("connected", users);
};

export const sendNotification = (
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
		io.to(activeUserId).emit("invite", {
			_id: sender._id,
			username: sender.username
		});
	});
};
