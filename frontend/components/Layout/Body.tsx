import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import { RootState } from "../../redux/store";
import MessageList from "../Message/MessageList";
import { getSockt } from "../../lib/socketServer";
import { useState } from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

type messages = {
  _id: string;
  author: { username: string };
  message: string;
  type: string;
  date: string;
}[];

type processedMessage = {
  _id: string;
  message: string;
  type: string;
  sameAuthor: boolean;
  username: string;
  date: string;
  time: string;
  sameDay: boolean;
};

const processMessage = (processedMessages: messages) => {
  const messages = processedMessages.map((message, i: number) => {
    const dateTime = new Date(message.date).toISOString().split("T");

    const processesMessage: processedMessage = {
      _id: message._id,
      username: message.author.username,
      message: message.message,
      type: message.type,
      sameAuthor:
        i > 0 &&
        processedMessages[i].author.username ===
          processedMessages[i - 1].author.username,
      sameDay:
        i > 0 &&
        new Date(processedMessages[i].date).toDateString() ===
          new Date(processedMessages[i - 1].date).toDateString(),
      date: dateTime[0],
      time: dateTime[1].slice(0, -8)
    };

    return processesMessage;
  });

  return messages;
};

function Body({ name }: { name: string | null }) {
  const [value, setValue] = useState("");

  const activeChat = useSelector((state: RootState) => state.chat.activeChat);
  const messages = processMessage(
    useSelector((state: RootState) => state.chat.messages)
  );

  const username = useSelector((state: RootState) => state.auth.username);

  if (!activeChat.id)
    return (
      <div className="mt-[4.5rem] flex flex-1 flex-col items-center justify-center bg-[#36393f] text-white">
        <h2 className="text-2xl">Welcome {name}</h2>
        <p>Please select a conversation to start chatting!</p>
      </div>
    );

  const sendMessage = () => {
    if (!value) return;

    const socket = getSockt();
    if (!socket) return;

    if (activeChat.chatType === "private") {
      socket.emit("private", {
        to: activeChat.id,
        message: value
      });
    } else {
      socket.emit("group", {
        to: activeChat.id,
        message: value
      });
    }

    setValue("");
  };

  return (
    <div className="mt-[5rem] flex flex-1 flex-col items-center bg-[#36393f] text-white">
      <h2 className="mt-3 flex items-center gap-2 text-2xl leading-none">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            activeChat.chatType === "private" ? "bg-[#2196f3]" : "bg-[#ed6c02]"
          }`}
        >
          {activeChat.chatType === "private"
            ? activeChat.name.slice(0, 1)
            : activeChat.name.slice(0, 2)}
        </span>
        <span>{activeChat.name}</span>
      </h2>
      <p>
        {activeChat.chatType === "private"
          ? `Start a conversation with ${
              activeChat.name === username ? "yourself" : activeChat.name
            }`
          : `Start a group conversation in ${activeChat.name}`}
      </p>
      {!messages.length ? (
        <p className="flex-1 text-xl font-bold text-[#ed6c02]">
          No conversation yet!
        </p>
      ) : (
        <MessageList messages={messages} />
      )}
      <div className="mt-auto flex w-full items-center gap-7 px-5 pb-4">
        <TextField
          InputProps={{
            style: { color: "#fff", padding: "0.8rem" }
          }}
          id="filled-textarea"
          rows={2}
          placeholder="Enter your message."
          multiline
          variant="outlined"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) sendMessage();
          }}
          sx={{
            marginTop: "auto",
            flex: "1"
          }}
        />

        <Button
          onClick={sendMessage}
          variant="outlined"
          endIcon={<SendIcon />}
          sx={{
            height: "80%",
            width: "16%",
            fontWeight: "bold"
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}

export default Body;
