import { apiSlice } from "./slices/apiSlice";
import authReducer from "./slices/authSlice";
import { combineReducers } from "@reduxjs/toolkit";
const rootReducer = () => {
  return combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  });
};
export default rootReducer;
