import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    totalJobs: 0,
    filter: {}
  },
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setTotalJobs: (state,action) => {
      state.totalJobs = action.payload;
    },
     setFilterSlice: (state,action) => {
      state.filter = action.payload;
    }
  },
});

export const { setJobs, setTotalJobs,setFilterSlice  } = jobSlice.actions;
export default jobSlice.reducer;
