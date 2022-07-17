import { useState, useEffect } from "react";
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
import { streamInfo } from "../../redux/slices/chatSlice";
import { getStream } from "../../lib/webRtc";

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

  const storedStreamsInfo = useSelector(
    (state: RootState) => state.chat.streamsInfo
  );

  const currentStreamInfo = useSelector(
    (state: RootState) => state.chat.streamInfo
  );

  const streamsInfo = currentStreamInfo
    ? [currentStreamInfo, ...storedStreamsInfo]
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
        {storedStreamsInfo.length > 0 ? (
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
            onClick={() => {
              setScreenShare((prevScreenShare) => !prevScreenShare);
            }}
          >
            {screenShare ? <StopScreenShare /> : <ScreenShare />}
          </IconButton>
        )}
        <IconButton
          className="h-6 w-6"
          color="inherit"
          onClick={() => {
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
          }}
        >
          <Close />
        </IconButton>
        {CallType === "video" && (
          <IconButton
            className="h-6 w-6"
            color="inherit"
            onClick={() => {
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
