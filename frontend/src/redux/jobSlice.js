import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    totalJobs: 0,
    filter: {},
    filterApplied: false,
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
    },
    setFilterApplied: (state, action) => {
      state.filterApplied = action.payload;
    },
  },
});

export const { setJobs, setTotalJobs,setFilterSlice, setFilterApplied } = jobSlice.actions;
export default jobSlice.reducer;
