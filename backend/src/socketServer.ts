import { Server as socketServer } from "socket.io";
import { Server as httpServer } from "http";
import { setIoInstance } from "./socketEvents";

const configureSocketServer = (httpServer: httpServer) => {
	const io = new socketServer(httpServer, {
		cors: {
			origin: "http://localhost:3000",
			allowedHeaders: ["GET", "POST"],
			credentials: true
		}
	});

	setIoInstance(io);
};

export default configureSocketServer;

/* lsof -i tcp:5000
kill -9 pid */
