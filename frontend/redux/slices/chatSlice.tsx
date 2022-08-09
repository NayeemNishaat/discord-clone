import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface chatState {
  activeChat: {
    id: string;
    name: string;
    chatType: "private" | "group" | "";
  };
  messages: {
    _id: string;
    author: { username: string };
    message: string;
    type: string;
    date: string;
  }[];
  message: {
    _id: string;
    author: { username: string };
    message: string;
    type: string;
    date: string;
  };
  members: { _id: string; username: string; isOnline: boolean }[];
  streamInfo: {
    stream: MediaStream;
    user: {
      _id: string | null;
      username: string | null;
    };
  } | null;
  streamsInfo: {
    stream: MediaStream;
    user: {
      _id: string | null;
      username: string | null;
    };
  }[];
}

const initialState: chatState = {
  activeChat: {
    id: "",
    name: "",
    chatType: ""
  },
  messages: [
    {
      _id: "",
      author: { username: "" },
      message: "",
      type: "",
      date: new Date().toISOString()
    }
  ],
  message: {
    _id: "",
    author: { username: "" },
    message: "",
    type: "",
    date: new Date().toISOString()
  },
  members: [],
  streamInfo: null,
  streamsInfo: []
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat: (
      state: chatState,
      action: PayloadAction<chatState["activeChat"]>
    ) => {
      state.activeChat.id = action.payload.id;
      state.activeChat.name = action.payload.name;
      state.activeChat.chatType = action.payload.chatType;
    },
    setMessages: (
      state: chatState,
      action: PayloadAction<chatState["messages"]>
    ) => {
      state.messages = action.payload;
    },
    pushMessage: (
      state: chatState,
      action: PayloadAction<chatState["message"]>
    ) => {
      state.messages.push(action.payload);
    },
    setMembers: (
      state: chatState,
      action: PayloadAction<chatState["members"]>
    ) => {
      state.members = action.payload;
    },
    updateMember: (
      state: chatState,
      action: PayloadAction<{
        _id: string;
        username: string;
        isOnline: boolean;
      }>
    ) => {
      state.members.forEach((member) => {
        if (member._id === action.payload._id) {
          member.isOnline = action.payload.isOnline;
        }
      });
    },
    streamInfo: (
      state: chatState,
      action: PayloadAction<chatState["streamInfo"]>
    ) => {
      state.streamInfo = action.payload;
    },
    streamsInfo: (
      state: chatState,
      action: PayloadAction<chatState["streamInfo"]>
    ) => {
      action.payload && state.streamsInfo.push(action.payload);
    },
    setStreamsInfo: (
      state: chatState,
      action: PayloadAction<chatState["streamsInfo"]>
    ) => {
      state.streamsInfo = action.payload;
    }
  }
});

export const {
  setActiveChat,
  setMessages,
  pushMessage,
  setMembers,
  updateMember,
  streamInfo,
  streamsInfo,
  setStreamsInfo
} = chatSlice.actions;
export default chatSlice.reducer;
