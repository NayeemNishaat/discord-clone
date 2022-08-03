import { useState } from "react";
import {
  VideocamOff,
  OpenInFull,
  CloseFullscreen,
  Close,
  Mic,
  ScreenShare,
  StopScreenShare,
  MicOff,
  Videocam
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import MediaList from "../Media/MediaList";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { setStreamsInfo } from "../../redux/slices/chatSlice";
import { closePeerConnection, switchTracks } from "../../lib/webRtc";
import socket from "../../lib/socketServer";

function CallWindow(
  this: any,
  {
    setOpenCallWindow,
    CallType
  }: { setOpenCallWindow: Function; CallType: string }
) {
  const [fullScreen, setFullScreen] = useState(false);
  const [mute, setMute] = useState(false);
  const [webcam, setWebcam] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [screenStreamInfo, setScreenStreamInfo] = useState<null | {
    stream: MediaStream;
    user: {
      _id: string | null;
      username: string | null;
    };
  }>(null);

  const dispatch = useDispatch();

  const storedStreamsInfo = useSelector(
    (state: RootState) => state.chat.streamsInfo
  );

  const currentStreamInfo = useSelector(
    (state: RootState) => state.chat.streamInfo
  );

  screenStreamInfo?.stream.getVideoTracks()[0].addEventListener("ended", () => {
    setScreenStreamInfo(null);
    switchTracks(currentStreamInfo.stream);
  });

  const streamsInfo = currentStreamInfo
    ? screenStreamInfo
      ? [screenStreamInfo, ...storedStreamsInfo]
      : [currentStreamInfo, ...storedStreamsInfo]
    : storedStreamsInfo;

  return (
    <div
      className={`fixed ${
        fullScreen
          ? "top-0 left-0 right-0 bottom-0 h-screen w-screen p-2"
          : "bottom-[110px] right-[10px] h-[250px] w-[250px]"
      } flex flex-col overflow-hidden rounded bg-black text-white`}
    >
      <div className="flex flex-1">
        {streamsInfo.length > 0 ? (
          <MediaList
            streamsInfo={streamsInfo}
            currentStreamInfo={currentStreamInfo}
            CallType={CallType}
          />
        ) : null}
      </div>
      <div className="mt-auto flex h-10 items-center justify-center gap-2 rounded-b bg-[#1976d2] px-2">
        {CallType === "video" && (
          <IconButton
            className="h-6 w-6"
            color="inherit"
            onClick={async () => {
              if (!screenShare) {
                try {
                  const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: false
                  });
                  setScreenStreamInfo({
                    stream,
                    user: {
                      _id: currentStreamInfo?.user._id || null,
                      username: currentStreamInfo?.user.username || null
                    }
                  });

                  setScreenShare((prevScreenShare) => !prevScreenShare);

                  switchTracks(stream);
                } catch (err) {
                  console.log(err);
                }
              } else {
                screenStreamInfo &&
                  screenStreamInfo?.stream
                    .getTracks()
                    .forEach((track) => track.stop());

                setScreenStreamInfo(null);
                setScreenShare((prevScreenShare) => !prevScreenShare);

                currentStreamInfo && switchTracks(currentStreamInfo.stream);
              }
            }}
          >
            {screenShare ? <ScreenShare /> : <StopScreenShare />}
          </IconButton>
        )}
        <IconButton
          className="h-6 w-6"
          color="inherit"
          onClick={() => {
            currentStreamInfo &&
              (currentStreamInfo.stream.getAudioTracks()[0].enabled = mute);
            setMute((prevMute) => !prevMute);
          }}
        >
          {mute ? <Mic /> : <MicOff />}
        </IconButton>
        <IconButton
          className="h-6 w-6"
          color="inherit"
          onClick={() => {
            setOpenCallWindow({
              status: false
            });

            currentStreamInfo?.stream.getTracks().forEach((track) => {
              track.stop();
            });

            screenStreamInfo &&
              screenStreamInfo?.stream
                .getTracks()
                .forEach((track) => track.stop());

            dispatch(setStreamsInfo([]));
            closePeerConnection();

            socket.emit("calleeLeft");
          }}
        >
          <Close />
        </IconButton>
        {CallType === "video" && (
          <IconButton
            className="h-6 w-6"
            color="inherit"
            onClick={() => {
              currentStreamInfo &&
                (currentStreamInfo.stream.getVideoTracks()[0].enabled = webcam);
              setWebcam((prevWebcam) => !prevWebcam);
            }}
          >
            {webcam ? <Videocam /> : <VideocamOff />}
          </IconButton>
        )}
        <IconButton
          className="h-6 w-6"
          color="inherit"
          onClick={() => {
            setFullScreen((prevFullscreen) => !prevFullscreen);
          }}
        >
          {fullScreen ? <CloseFullscreen /> : <OpenInFull />}
        </IconButton>
      </div>
    </div>
  );
}

export default CallWindow;
