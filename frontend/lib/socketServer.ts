import { io } from "socket.io-client";
import { setSocketInstance } from "./socketController";

export const connectWithSocketServer = () => {
	setSocketInstance(
		io("http://localhost:5000", {
			withCredentials: true
		})
	);
};
