import { io, Socket } from "socket.io-client";

let socket: Socket;

const connectSocketServer = () => {
	socket = io("http://localhost:5000", {
		withCredentials: true
	});

	socket.on("connect", () => {
		console.log(socket.id);
	});
};

export const disconnectAndRemoveUser = () => {
	socket.disconnect();
	socket.emit("removeUser")
};

export default connectSocketServer;
