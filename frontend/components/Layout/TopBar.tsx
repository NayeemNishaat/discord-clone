import { useState, useEffect } from "react";
import { getSockt } from "../../lib/socketServer";
import Snackbar from "@mui/material/Snackbar";
import Slide, { SlideProps } from "@mui/material/Slide";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setLoginInfo } from "../../redux/slices/authSlice";
import { receivedInvitations, friends } from "../../redux/slices/userSlice";
import { AddIcCall, VideoCall } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import CallWindow from "../UI/CallWindow";

function TopBar() {
  const [open, setOpen] = useState(false);
  const [openCallWindow, setOpenCallWindow] = useState({
    status: false,
    type: ""
  });

  const router = useRouter();
  const activeChat = useSelector((state: RootState) => state.chat.activeChat);
  const members = useSelector((state: RootState) => state.chat.members);
  const dispatch = useDispatch();
  const socket = getSockt();

  useEffect(() => {
    if (!socket) return;

    socket.on("incomingCall", (data) => {
      setOpenCallWindow({
        status: true,
        type: data.callType
      });

      socket.emit("callInit", data.user);
    });
  }, [socket]);
  const activeMembers = members.filter((member) => member.isOnline);

  const initCall = (callType: string) => {
    if (!socket) return;

    socket.emit("startCall", {
      activeMembers:
        activeChat.chatType === "group"
          ? activeMembers
          : activeMembers.filter((member) => member._id === activeChat.id),
      callType
    });
  };

  return (
    <div className="absolute right-0 flex h-[5rem] w-[calc(100%-21rem)] items-center justify-between bg-[#202124]">
      <div className="flex gap-5">
        <span className="ml-5  text-white">{activeChat.name}</span>
        {activeChat.name && (
          <>
            <IconButton
              className="h-6 w-6"
              color="warning"
              disabled={openCallWindow.status}
              onClick={() => {
                setOpenCallWindow({
                  status: true,
                  type: "audio"
                });

                initCall("audio");
              }}
            >
              <AddIcCall />
            </IconButton>
            <IconButton
              className="h-6 w-6"
              color="warning"
              disabled={openCallWindow.status}
              onClick={() => {
                setOpenCallWindow({
                  status: true,
                  type: "video"
                });

                initCall("video");
              }}
            >
              <VideoCall />
            </IconButton>
          </>
        )}
      </div>
      <Button
        sx={{ marginRight: "20px" }}
        color="warning"
        variant="outlined"
        onClick={async () => {
          try {
            localStorage.removeItem("loginInfo");

            await fetch(`${process.env.NEXT_PUBLIC_HOST}/auth/logout`, {
              method: "GET",
              credentials: "include"
            });

            dispatch(
              setLoginInfo({
                _id: null,
                email: null,
                username: null
              })
            );
            dispatch(receivedInvitations([]));
            dispatch(friends([]));

            router.replace("/");
          } catch (err) {
            setOpen(true);
          }
        }}
      >
        Logout
      </Button>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={5000}
        message="Failed to Logout"
        TransitionComponent={(props: SlideProps) => {
          return <Slide {...props} direction="down" />;
        }}
        onClose={() => setOpen(false)}
      ></Snackbar>

      {openCallWindow.status && (
        <CallWindow
          setOpenCallWindow={setOpenCallWindow}
          CallType={openCallWindow.type}
        />
      )}
    </div>
  );
}

export default TopBar;
