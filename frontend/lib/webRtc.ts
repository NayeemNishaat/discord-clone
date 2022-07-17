import Peer, { Instance } from "simple-peer";
import socket from "./socketServer";
import store from "../redux/store";
import { streamsInfo, streamInfo } from "../redux/slices/chatSlice";

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

export const initPeerConnection = async (id: string, isInitiator: boolean) => {
  if (isInitiator) {
    console.log("Initiator");
  } else {
    console.log("Not Initiator");
  }

  const stream = await getStream(true, true);
  store.dispatch(
    streamInfo({
      stream: stream,
      user: store.getState().auth
    })
  );

  peers[id] = new Peer({
    initiator: isInitiator,
    config: getConfig(),
    stream: stream
  });

  peers[id].on("signal", (data) => {
    const signalInfo = { signal: data, id };

    // Part: Send signalInfo to other users
    socket.emit("connSignal", signalInfo);
  });

  peers[id].on("stream", (remoteStream) => {
    // Part: Add remote stream to video element
    store.dispatch(
      streamsInfo({
        stream: remoteStream,
        user: { _id: "id", username: "Remote" }
      })
    );
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
