import ActivityBar from "../components/Layout/ActivityBar";
import SideBar from "../components/Layout/SideBar";
import TopBar from "../components/Layout/TopBar";
import Body from "../components/Layout/Body";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CircularProgress } from "@mui/material";
import { initSocket } from "../lib/socketServer";
import { useDispatch } from "react-redux";
import {
  receivedInvitations,
  friends,
  updateFriend,
  groups
} from "../redux/slices/userSlice";
import {
  setMembers,
  pushMessage,
  setMessages,
  updateMember
} from "../redux/slices/chatSlice";
import {
  initPeerConnection,
  handleConnectionInfo,
  handleCalleeLeft
} from "../lib/webRtc";

type message = {
  _id: string;
  author: { username: string };
  message: string;
  type: string;
  date: string;
};

type messages = {
  _id: string;
  author: { username: string };
  message: string;
  type: string;
  date: string;
}[];

function dashboard() {
  const [component, setComponent] = useState(
    <div className="flex h-screen w-full items-center justify-center">
      <CircularProgress color="secondary" />
    </div>
  );

  const dispatch = useDispatch();
  const router = useRouter();
  const loginInfo = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!loginInfo._id) {
      router.push("/");
      return;
    }

    setComponent(
      <>
        <ActivityBar />
        <SideBar />
        <Body name={loginInfo.username} />
        <TopBar />
      </>
    );

    const socket = initSocket();

    socket.on("error", (_msg) => {
      localStorage.removeItem("loginInfo");
      router.push("/");
    });

    socket.on(
      "friend",
      (
        userFriends: {
          _id: string;
          username: string;
          isOnline: boolean;
        }[]
      ) => {
        dispatch(friends(userFriends));
        dispatch(setMembers(userFriends));
      }
    );

    socket.on(
      "invite",
      (
        sender: {
          _id: string;
          username: string;
          groupId: string;
          groupName: string;
        }[]
      ) => {
        dispatch(receivedInvitations(sender));
      }
    );

    socket.on(
      "friendOnline",
      (onlineFriend: { _id: string; username: string; isOnline: boolean }) => {
        dispatch(updateFriend(onlineFriend));
        dispatch(updateMember(onlineFriend));
      }
    );

    socket.on("groupList", (groupsData) => {
      dispatch(groups(groupsData));
    });

    socket.on("private", (message: message) => {
      dispatch(pushMessage(message));
    });

    socket.on("group", (message: message) => {
      dispatch(pushMessage(message));
    });

    socket.on("privateHistory", (messages: messages) => {
      if (!messages) return dispatch(setMessages([]));

      dispatch(setMessages(messages));
    });

    socket.on("groupHistory", (messages: messages) => {
      if (!messages) return dispatch(setMessages([]));

      dispatch(setMessages(messages));
    });

    socket.on("connPrepare", async (data) => {
      await initPeerConnection(data, false);
      socket.emit("connInit", data.id);
    });

    socket.on("connInit", async (data) => {
      await initPeerConnection(data, true);
    });

    socket.on("connSignal", (connectionInfo) => {
      handleConnectionInfo(connectionInfo);
    });

    socket.on("calleeLeft", (data) => {
      handleCalleeLeft(data);
    });
  }, [loginInfo._id]);

  return <section className="relative flex bg-[#5866f2]">{component}</section>;
}

export default dashboard;
