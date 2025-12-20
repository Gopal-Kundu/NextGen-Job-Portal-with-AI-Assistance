import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import jobSlice from "./jobSlice.js";
import applicantSlice from "./applicantSlice.js";
import resumeSlice from "./resumeSlice.js";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    job : jobSlice,
    applicant: applicantSlice,
    resume: resumeSlice,
  }
});

 