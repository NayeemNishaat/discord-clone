import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authState {
	email: string | null;
	password: string | null;
}

const initialState: authState = {
	email: null,
	password: null
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (
			state: authState,
			action: PayloadAction<{ email: string; password: string }>
		) => {
			state.email = action.payload.email;
			state.password = action.payload.password;
		}
	}
});

export const { login } = authSlice.actions;
export default authSlice.reducer;
