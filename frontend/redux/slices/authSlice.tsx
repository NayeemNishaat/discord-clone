import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authState {
	_id: string | null;
	email: string | null;
	name: string | null;
}

const initialState: authState = {
	_id: null,
	email: null,
	name: null
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loginInfo: (
			state: authState,
			action: PayloadAction<{ _id: string; email: string; name: string }>
		) => {
			state._id = action.payload._id;
			state.email = action.payload.email;
			state.name = action.payload.name;
		}
	}
});

export const { loginInfo } = authSlice.actions;
export default authSlice.reducer;
