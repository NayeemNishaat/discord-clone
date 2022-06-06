import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import userSlice from "./slices/userSlice";
import chatSlice from "./slices/chatSlice";

const store = configureStore({
	reducer: {
		auth: authSlice,
		user: userSlice,
		chat: chatSlice
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
