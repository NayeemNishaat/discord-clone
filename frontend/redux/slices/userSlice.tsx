import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userState {
	friends: { _id: string; username: string }[];
	receivedInvitations: { name: string; isOnline: boolean }[];
}

const initialState: userState = {
	friends: [],
	receivedInvitations: []
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		receivedInvitations: (
			state: userState,
			action: PayloadAction<userState["receivedInvitations"]>
		) => {
			state.receivedInvitations = action.payload;
		},
		friends: (
			state: userState,
			action: PayloadAction<userState["friends"]>
		) => {
			state.friends = action.payload;
		}
	}
});

export const { receivedInvitations, friends } = userSlice.actions;
