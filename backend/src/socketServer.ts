import { Server as socketServer, Socket } from "socket.io";
import { Server as httpServer } from "http";
import {
	verifyUser,
	connectedUsers
} from "../src/controllers/socketController";

const configureSocketServer = (httpServer: httpServer) => {
	const io = new socketServer(httpServer, {
		cors: {
			origin: "http://localhost:3000",
			allowedHeaders: ["GET", "POST"],
			credentials: true
		}
	});

	io.use(async (socket, next) => {
		verifyUser(socket, next);
	});

	io.on("connection", (socket: Socket) => {
		connectedUsers(socket);
	});
};

export default configureSocketServer;

/* lsof -i tcp:5000
kill -9 pid */
