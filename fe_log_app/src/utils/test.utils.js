import { configureStore } from "@reduxjs/toolkit";
import { render as rtlRender } from "@testing-library/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { apiSlice } from "../redux/slices/apiSlice";
import authReducer from "../redux/slices/authSlice";
import { createMemoryHistory } from "history";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV === "development",
});
const history = createMemoryHistory();
const fakeLoginAPIResponse = {
  user: JSON.stringify({
    id: 1,
    username: "username",
    lastlogin: null,
  }),
  access: "123",
  refresh: "234",
}

export const testRender = (component) =>
  rtlRender(
    <Provider store={store}>
      <Router location={history.location} navigator={history}>{component}</Router>
    </Provider>
  );

export { history, fakeLoginAPIResponse } ;
