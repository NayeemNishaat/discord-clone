import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { AppError } from "../lib/error";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

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
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
	next: { (err?: ExtendedError | undefined): void; (arg0: undefined): void }
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
