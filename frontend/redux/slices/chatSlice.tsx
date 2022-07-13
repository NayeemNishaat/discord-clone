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
	currentUserStreamInfo: {
		stream: MediaStream;
		user: {
			_id: string | null;
			username: string | null;
		};
	} | null;
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
	currentUserStreamInfo: null
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
		currentUserStreamInfo: (
			state: chatState,
			action: PayloadAction<chatState["currentUserStreamInfo"]>
		) => {
			state.currentUserStreamInfo = action.payload;
		}
	}
});

export const {
	setActiveChat,
	setMessages,
	pushMessage,
	setMembers,
	currentUserStreamInfo
} = chatSlice.actions;
export default chatSlice.reducer;
