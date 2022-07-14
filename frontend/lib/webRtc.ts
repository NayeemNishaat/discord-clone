import Peer, { Instance } from "simple-peer";
import socket from "./socketServer";
import store from "../redux/store";
// import {} from "../redux/slices/chatSlice.tsx";

export const getStream = async (audio: boolean, video: boolean) => {
    return await navigator.mediaDevices.getUserMedia({
        audio,
        video
    });
};

const getConfig = () => {
    const TURNServer = null;

    if (TURNServer) {
        // TODO: Configure TURN server
    } else {
        console.warn("Using STUN server only!");

        return {
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302"
                }
            ]
        };
    }
};

let peers: {
    [x: string]: Instance;
} = {};

export const initPeerConnection = (id: string, isInitiator: boolean) => {
    if (isInitiator) {
    } else {
    }

    peers[id] = new Peer({
        initiator: isInitiator,
        config: getConfig(),
        stream: store.getState().chat.streamInfo?.stream
    });

    peers[id].on("signal", (data) => {
        const signalInfo = { signal: data, id };

        // Remark: Send signalInfo to other users
        socket.emit("connSignal", signalInfo);
    });
    console.log(peers, id);
    peers[id].on("stream", (remoteStream) => {
        // TODO: Add remote stream to video element
        // store.dispatch()
    });
};

export const handleConnectionInfo = (connectionInfo: {
    id: string;
    signal: Peer.SignalData;
}) => {
    if (peers[connectionInfo.id]) {
        peers[connectionInfo.id].signal(connectionInfo.signal);
    }
};
