import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";
import chatReducer from "@/features/chat/store/chatSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
});


export default rootReducer;