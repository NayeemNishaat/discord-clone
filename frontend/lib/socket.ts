import { io } from "socket.io-client";

const connectSocketServer = () => {
	const socket = io("http://localhost:5000", {
		withCredentials: true
	});

	socket.on("connect", () => {
		console.log(socket.id);
	});

	// if (confirm) return;
	// socket.disconnect();
	// console.log("disconnected");
};

export default connectSocketServer;
