import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userState {
  friends: { _id: string; username: string; isOnline: boolean }[];
  receivedInvitations: {
    _id: string;
    username: string;
    groupId: string;
    groupName: string;
  }[];
  groups: {
    _id: string;
    name: string;
    members: { _id: string; username: string; isOnline: boolean }[];
  }[];
}

const initialState: userState = {
  friends: [],
  receivedInvitations: [],
  groups: []
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
    updateFriend: (
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
    },
    groups: (
      state: userState,
      action: PayloadAction<
        {
          _id: string;
          name: string;
          owner: string;
          members: {
            _id: string;
            username: string;
            isOnline: boolean;
          }[];
        }[]
      >
    ) => {
      state.groups = action.payload;
    }
  }
});

export const { receivedInvitations, friends, updateFriend, groups } =
  userSlice.actions;
export default userSlice.reducer;
