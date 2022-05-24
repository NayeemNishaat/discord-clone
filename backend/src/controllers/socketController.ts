import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { AppError } from "../lib/error";
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

	if (!token) return next(new AppError("Please log in to get access!", 401));

	const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

	const currentUser = await User.findById(decoded.id);

	if (!currentUser)
		return next(
			new AppError(
				"The user belonging to this token does no longer exist.",
				401
			)
		);

	socket.data = currentUser;
	next();
};

const users = new Map();
export const connectedUsers = (socket: Socket) => {
	const values = users.values();

	for (const value of values) {
		if (value !== socket.data._id.toString())
			users.set(socket.id, socket.data._id.toString());
	}

	users.size === 0 && users.set(socket.id, socket.data._id.toString());

	socket.on("disconnect", () => {
		users.delete(socket.id);
		console.log(users);
	});

	socket.on("removeUser", () => {
		users.delete(socket.id);
		console.log(users);
	});

	console.log(users);
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
		if (value === receiver) activeUserIds.push(key); // Note: Finding active receiver's SockId!
	});

	activeUserIds.forEach((activeUserId) => {
		io.to(activeUserId).emit("invitation", sender);
	});
};
