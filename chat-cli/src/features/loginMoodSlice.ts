import { createSlice } from "@reduxjs/toolkit";
import { Iuser } from "../types/userTypes";

export interface AuthState {
  auth: any;
  isLoggedIn: boolean;
  user: Iuser;
  userContact: any[]; // You can replace "any[]" with the appropriate type for user contact data
  addUserMode: boolean;
}

const authSlice = createSlice({
  name: "auth",
  initialState: <AuthState>{
    isLoggedIn: false,
    user: {},
    userContact: <any>[],
    addUserMode: false,
  },
  reducers: {
    setLoginStatus: (state) => {
      state.isLoggedIn = true;
    },
    setLogout: (state) => {
      state.isLoggedIn = false;
    },
    setUserDetails: (state, action) => {
      state.user = action.payload;
    },
    setUserContactChat: (state, action) => {
      state.userContact = action.payload;
    },

    addUserModeActive: (state) => {
      state.addUserMode = true;
    },
    closeAddUserMode: (state) => {
      state.addUserMode = false;
    },
  },
});

export const {
  setLoginStatus,
  setLogout,
  setUserDetails,
  setUserContactChat,
  addUserModeActive,
  closeAddUserMode,
} = authSlice.actions;
export default authSlice.reducer;
