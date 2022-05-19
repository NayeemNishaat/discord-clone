import { Server as socketServer, Socket } from "socket.io";
import { Server as httpServer } from "http";

const configureSocketServer = (httpServer: httpServer) => {
	const io = new socketServer(httpServer, {});

	io.on("connection", (socket: Socket) => {
		console.log("user connected!");
		console.log(socket.id);
	});
};

export default configureSocketServer;
