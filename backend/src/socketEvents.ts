import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { verifyUser, connectedUsers } from "./controllers/socketController";

type io = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
let ioInstance: io;

export const setIoInstance = (io: io) => {
	ioInstance = io;

	io.use(async (socket, next) => {
		verifyUser(socket, next);
	});

	io.on("connection", (socket: Socket) => {
		connectedUsers(socket);
	});
};

export const getIoInstance = () => ioInstance;
