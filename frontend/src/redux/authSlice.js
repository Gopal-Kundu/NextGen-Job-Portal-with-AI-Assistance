import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    notificationCount : 0,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setNotificationCount: (state, action) => {
      state.notificationCount = action.payload;
    },
    addJobToUser: (state, action) => {
      state.user?.postedJobs?.push(action.payload);
    }
  }
});
 
export const { setLoading, setUser, setNotificationCount, addJobToUser } = authSlice.actions;
export default authSlice.reducer;
