import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authState {
	_id: string | null;
	email: string | null;
	username: string | null;
}

const initialState: authState = {
	_id: null,
	email: null,
	username: null
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loginInfo: (
			state: authState,
			action: PayloadAction<{
				_id: string | null;
				email: string | null;
				username: string | null;
			}>
		) => {
			state._id = action.payload._id;
			state.email = action.payload.email;
			state.username = action.payload.username;
		}
	}
});

export const { loginInfo } = authSlice.actions;
export default authSlice.reducer;
