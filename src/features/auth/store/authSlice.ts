import { createSlice } from "@reduxjs/toolkit";

import type { UserRole } from "@/shared/types/role";

interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
}

interface AuthState {
  user: UserPayload | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

export default authSlice.reducer;