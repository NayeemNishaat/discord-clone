import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userState {
	friends: { _id: string; username: string; isOnline: boolean }[];
	receivedInvitations: { _id: string; username: string }[];
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
		},
		addActiveFriend: (
			state: userState,
			action: PayloadAction<{
				_id: string;
				username: string;
				isOnline: boolean;
			}>
		) => {
			state.friends.forEach((friend) => {
				if (friend._id === action.payload._id) {
					friend.isOnline = action.payload.isOnline;
				}
			});
		}
	}
});

export const { receivedInvitations, friends, addActiveFriend } =
	userSlice.actions;
export default userSlice.reducer;
