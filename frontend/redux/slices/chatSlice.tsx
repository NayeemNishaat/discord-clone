import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface chatState {
	activeChat: {
		id: string;
		name: string;
		chatType: "private" | "group" | "";
	};
	messages: string[];
}

const initialState: chatState = {
	activeChat: {
		id: "",
		name: "",
		chatType: ""
	},
	messages: []
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
		}
	}
});

export const { setActiveChat } = chatSlice.actions;
export default chatSlice.reducer;
