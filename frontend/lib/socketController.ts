// import { Socket } from "socket.io-client";
// import { useDispatch } from "react-redux";
// import { receivedInvitations } from "../redux/slices/userSlice";

// let socketInstance: Socket;
// export const setSocketInstance = (socket: Socket) => {
// 	// const dispatch = useDispatch();
// 	socketInstance = socket;

// 	socket.on("connect", () => {
// 		console.log(socket.id);
// 	});
// };

// export const receivedInvitations = () => {
// 	socketInstance.on("invite", (sender) => {
// 		console.log(sender);
// 		// dispatch(receivedInvitations(sender));
// 	});
// };

// export const disconnectAndRemoveUser = () => {
// 	socketInstance.disconnect();
// 	socketInstance.emit("removeUser");
// };
