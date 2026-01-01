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
    }
  }
});
 
export const { setLoading, setUser, setNotificationCount } = authSlice.actions;
export default authSlice.reducer;
