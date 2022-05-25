import { Socket } from "socket.io-client";

let socketInstance: Socket;
export const setSocketInstance = (socket: Socket) => {
	socketInstance = socket;

	socket.on("connect", () => {
		console.log(socket.id);
	});

	socket.on("invite", (sender) => {
		console.log(sender);
	});
};

export const disconnectAndRemoveUser = () => {
	socketInstance.disconnect();
	socketInstance.emit("removeUser");
};
