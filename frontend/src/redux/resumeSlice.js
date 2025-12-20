import { createSlice } from "@reduxjs/toolkit";

const resumeSlice = createSlice({
  name: "resume",
  initialState: {
    templateSrc: [],
    personalDetails: [],
    education: [],
    experience: [],
    projects: [],
    skills: [],
    achievements: [],
    addExtra: [],
  },
  reducers: {
    setTemplateSrc: (state, action) => {
      state.templateSrc = action.payload;
    },
    setPersonalDetails: (state, action) => {
      state.personalDetails.push(action.payload);
    },
    setEducation: (state, action) => {
      state.education.push(action.payload);
    },
    setExperience: (state, action) => {
      state.experience.push(action.payload);
    },
    setProjects: (state, action) => {
      state.projects.push(action.payload);
    },
    setSkills: (state, action) => {
      state.skills.push(action.payload);
    },
    setAchievements: (state, action) => {
      state.achievements.push(action.payload);
    },
    setAddExtra: (state, action) => {
      state.addExtra.push(action.payload);
    },
  },
});

export const {
  setPersonalDetails,
  setEducation,
  setExperience,
  setProjects,
  setSkills,
  setAchievements,
  setAddExtra,
  setTemplateSrc,
} = resumeSlice.actions;

export default resumeSlice.reducer;
