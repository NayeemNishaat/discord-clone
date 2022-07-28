import Peer, { Instance } from "simple-peer";
import socket from "./socketServer";
import store from "../redux/store";
import {
  streamsInfo,
  streamInfo,
  setStreamsInfo
} from "../redux/slices/chatSlice";

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

export const initPeerConnection = async (
  data: { id: string; user: { _id: string; username: string } },
  isInitiator: boolean
) => {
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

  peers[data.id] = new Peer({
    initiator: isInitiator,
    config: getConfig(),
    stream: stream
  });

  peers[data.id].on("signal", (signalData) => {
    const signalInfo = { signal: signalData, id: data.id };

    // Part: Send signalInfo to other users
    socket.emit("connSignal", signalInfo);
  });

  peers[data.id].on("stream", (remoteStream) => {
    // Part: Add remote stream to video element
    store.dispatch(
      streamsInfo({
        stream: remoteStream,
        user: { _id: data.user._id, username: data.user.username }
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

export const closePeerConnection = () => {
  Object.entries(peers).forEach(([id, _peer]) => {
    if (!id) return;
    peers[id].destroy();
    delete peers[id];
  });
};

export const handleCalleeLeft = (data: {
  id: string;
  user: { _id: string; username: string };
}) => {
  if (!peers[data.id]) return;
  peers[data.id].destroy();
  delete peers[data.id];

  const filteredStreamsInfo = store
    .getState()
    .chat.streamsInfo.filter((stream) => stream.user._id !== data.user._id);

  const currentStream = store.getState().chat.streamInfo;
  currentStream && filteredStreamsInfo.unshift(currentStream);

  store.dispatch(setStreamsInfo(filteredStreamsInfo));
};
