import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authState {
	id: string | null;
	password: string | null;
}

const initialState: authState = {
	id: null,
	password: null
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		test: (state, action: PayloadAction<string>) => {
			state.id = action.payload;
		}
	}
});

export const { test } = authSlice.actions;
export default authSlice.reducer;
