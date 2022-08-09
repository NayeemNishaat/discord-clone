import { DefaultEventsMap } from "@socket.io/component-emitter";
import { io, Socket } from "socket.io-client";

let socket: Socket<DefaultEventsMap> | null = null;

export const initSocket = () => {
  socket = io(`${process.env.NEXT_PUBLIC_SOCKET_HOST}`, {
    withCredentials: true
  });

  socket.on("connect", () => {
    console.log(`${socket?.id} Connected!`);
  });

  return socket;
};

export const getSockt = () => {
  return socket;
};
