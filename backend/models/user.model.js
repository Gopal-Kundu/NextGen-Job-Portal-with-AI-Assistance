const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      default: "Anonymous User",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      default: "example@example.com",
    },
    createdCompanies: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
      default: [],
    },
    phonenumber: { type: Number, required: true, default: 1234567890 },
    password: {
      type: String,
      required: true,
      default: "password123",
    },
    role: { type: String, enum: ["student", "recruiter"], default: "student" },
    profile: {
      bio: { type: String, trim: true, default: "No bio provided." },
      skills: { type: String, default: "Not specified" },
      resume: { type: String, default: "" },
      profilePhoto: {
        type: String,
        default:
          "https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png",
      },
    },

    savedJobs: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
      default: [],
    },

    approvedJobs: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
      default: [],
    },

    rejectedJobs: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
      default: [],
    },

    appliedJobs: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
      default: [],
    },

    postedJobs: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
