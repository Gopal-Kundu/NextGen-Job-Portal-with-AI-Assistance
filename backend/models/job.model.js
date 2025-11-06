const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled Job",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      default: "No description provided.",
    },
    salary: { type: Number, default: 0 },
    location: { type: String, trim: true, default: "Not specified" },
    requirements: {
      type: String,
      trim: true,
      default: "No specific requirements",
    },
    experience: { type: Number, default: 0 },
    jobType: { type: String, trim: true, default: "Full-time" },
    vacancy: { type: Number, default: 1 },
    company: { type: String, trim: true, default: "Unknown Company" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    logo: {
      type: String,
      default:
        "https://media.wired.com/photos/65e88c25b8b2544099643d3d/master/w_1600,c_limit/aaaoriginal.jpg",
    },

    applications: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    approvedApplicant: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    rejectedApplicant: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);
module.exports = Job;
