const mongoose = require("mongoose");

const dashBoardPositionSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    YearsOfExperience: {
        type: String,
        default: ""
    },
    skills: {
        type: String,
        default: ""
      },
      description: {
        type: String,
        default: ""
      },
    QuestionsWithAnswer: [
      {
        Qs: {
          type: String,
          required: true,
        },
        Ans: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const DashBoardPosition = mongoose.model("DashBoardPosition", dashBoardPositionSchema);
module.exports = DashBoardPosition;