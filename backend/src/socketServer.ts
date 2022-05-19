import { Server as socketServer, Socket } from "socket.io";
import { Server as httpServer } from "http";
import verifyJwt from "./lib/verifyJwt";

const configureSocketServer = (httpServer: httpServer) => {
	const io = new socketServer(httpServer, {
		cors: {
			origin: "http://localhost:3000",
			allowedHeaders: ["GET", "POST"],
			credentials: true
		}
	});

	io.use(async (socket, next) => {
		verifyJwt(socket.handshake.headers.cookie, next);
		next();
	});

	io.on("connection", (socket: Socket) => {
		console.log("user connected!");
		console.log(socket.id);
	});
};

export default configureSocketServer;
