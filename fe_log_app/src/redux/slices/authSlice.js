import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
  let state = {
    access: localStorage.getItem("access"),
    refresh: localStorage.getItem("refresh"),
  };
  //checking if the user present is a json, just in case someone has changed the access
  try {
    state["user"] = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    state["user"] = null; // error in the above string (in this case, yes)!
  }
  return state;
};
//slice for the state management of the user and token
const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      const { user, access, refresh } = action.payload;
      state.user = user;
      state.access = access;
      state.refresh = refresh;
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("access", state.access);
      localStorage.setItem("refresh", state.refresh);
    },
    logOut: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.access;
export const selectRefreshToken = (state) => state.auth.refresh;
