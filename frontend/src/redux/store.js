import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import jobSlice from "./jobSlice.js";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    job : jobSlice
  }
});

 