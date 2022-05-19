import { Server as socketServer, Socket } from "socket.io";
import { Server as httpServer } from "http";
import { protect } from "./controllers/authController";

const configureSocketServer = (httpServer: httpServer) => {
	const io = new socketServer(httpServer, {
		cors: {
			origin: "http://localhost:3000",
			allowedHeaders: ["GET", "POST"],
			credentials: true
		}
	});

	io.use((socket, next) => {
		console.log(socket);
		next();
		// protect(socket.request, Response, next);
	});

	io.on("connection", (socket: Socket) => {
		console.log("user connected!");
		console.log(socket.id);
	});
};

export default configureSocketServer;
