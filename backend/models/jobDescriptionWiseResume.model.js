const mongoose = require("mongoose");

const jobDescriptionWiseResumeSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recomendedYoutubeSearchesAndCourses: {
      type: String,
      default: "",
    },
    WeakSpotInResume: {
      type: String,
      default: "",
    },
    initialATSScore: {
      type: Number,
      default: 0,
    },
    ATSScoreOfResume: {
      type: Number,
      default: 0,
    },
    AtsResumeJson: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const JobDescriptionWiseResume = mongoose.model(
  "JobDescriptionWiseResume",
  jobDescriptionWiseResumeSchema
);

module.exports = JobDescriptionWiseResume;
