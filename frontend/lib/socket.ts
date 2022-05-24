import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
	withCredentials: true
});

socket.on("connect", () => {
	console.log(socket.id);
});

socket.on("invite", (sender) => {
	console.log(sender);
});

export const disconnectAndRemoveUser = () => {
	socket.disconnect();
	socket.emit("removeUser");
};

export default socket;
