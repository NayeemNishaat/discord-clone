import { Server as socketServer, Socket } from "socket.io";
import { Server as httpServer } from "http";
import { AppError } from "./lib/error";
import jwt from "jsonwebtoken";
import User from "./models/userModel";

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

const configureSocketServer = (httpServer: httpServer) => {
	let token: string;

	const io = new socketServer(httpServer, {
		cors: {
			origin: "http://localhost:3000",
			allowedHeaders: ["GET", "POST"],
			credentials: true
		}
	});

	io.use(async (socket, next) => {
		if (socket.handshake.headers.cookie) {
			socket.handshake.headers.cookie.split("; ").forEach((el) => {
				const arr = el.split("=");
				if (arr[0] === "jwt") token = arr[1];
			});
		}

		if (!token)
			return next(new AppError("Please log in to get access!", 401));

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
	});

	const connectedUsers = new Map();

	io.on("connection", (socket: Socket) => {
		const values = connectedUsers.values();

		for (const value of values) {
			if (value !== socket.data._id.toString())
				connectedUsers.set(socket.id, socket.data._id.toString());
		}

		connectedUsers.size === 0 &&
			connectedUsers.set(socket.id, socket.data._id.toString());

		socket.on("disconnect", () => {
			connectedUsers.delete(socket.id);
			console.log(connectedUsers);
		});

		socket.on("removeUser", () => {
			connectedUsers.delete(socket.id);
			console.log(connectedUsers);
		});

		console.log(connectedUsers);
	});
};

export default configureSocketServer;
