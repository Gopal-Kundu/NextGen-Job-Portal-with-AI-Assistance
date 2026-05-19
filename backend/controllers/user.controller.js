const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getDataUri = require("../utils/datauri");
const cloudinary = require("../utils/cloudinary");
const Job = require("../models/job.model");
const Notification = require("../models/notification.model");
const DashBoardPosition = require("../models/dashboard.model");
const { aiApi, parseGeminiJSON } = require("./ai.controller");
require("dotenv").config({ quiet: true });

const register = async (req, res) => {
  try {
    const { fullname, email, phonenumber, password, role } = req.body;

    if (!fullname || !email || !phonenumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phonenumber,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
      role: user.role
    };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "2d",
    });
    user.loggedIn = true;
    await user.save();
    await user.populate("createdCompanies");
    await user.populate("savedJobs");
    await user.populate("postedJobs");
    await user.populate("appliedJobs");
    await user.populate("notifications");
    await user.populate("recruiterNotification");
    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      createdCompanies: user.createdCompanies,
      phonenumber: user.phonenumber,
      role: user.role,
      profile: user.profile,
      savedJobs: user.savedJobs,
      postedJobs: user.postedJobs,
      appliedJobs: user.appliedJobs,
      notifications: user.role === "recruiter" ? user.recruiterNotification : user.notifications,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: userData,
        success: true,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const logout = async (req, res) => {
  try {
    let user = await User.findById(req.id);
    user.loggedIn = false;
    await user.save();
    res.status(200).clearCookie("token", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    }).json({
      message: "Logged Out Successfully",
      success: true,
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const updateProfile = async (req, res) => {
  const { fullname, role, phonenumber, bio, skills } = req.body;

  const fileResume = req.files?.resume?.[0];
  const profilePhoto = req.files?.profilePhoto?.[0];

  let fileResumeCloudResponse;
  let profilePhotoCloudResponse;

  try {
    if (fileResume) {
      const fileResumeUri = getDataUri(fileResume);
      fileResumeCloudResponse = await cloudinary.uploader.upload(
        fileResumeUri.content,
        {
          folder: "Job Portal Uploads/Resumes",
          resource_type: "auto",
        }
      );
    }

    if (profilePhoto) {
      const fileProfilePhotoUri = getDataUri(profilePhoto);
      profilePhotoCloudResponse = await cloudinary.uploader.upload(
        fileProfilePhotoUri.content,
        {
          folder: "Job Portal Uploads/Profile Photos",
          resource_type: "auto",
        }
      );
    }

    const user = await User.findById(req.id);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    if (fullname) user.fullname = fullname;
    if (role) user.role = role;
    if (phonenumber) user.phonenumber = phonenumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills;

    if (profilePhotoCloudResponse) {
      user.profile.profilePhoto = profilePhotoCloudResponse.secure_url;
    }
    if (fileResumeCloudResponse) {
      user.profile.resume = fileResumeCloudResponse.secure_url;
    }

    await user.save();

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

const applyJobs = async (req, res) => {
  const id = req.id;
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "User is not authenticated" });
  }

  const { jobId } = req.body;

  const job = await Job.findById(jobId);
  if (!job)
    return res.status(400).json({ success: false, message: "No Job Found." });

  const user = await User.findById(id);

  if (user.appliedJobs.includes(jobId)) {
    user.appliedJobs.pull(jobId);
    await user.save();
    job.applications.pull(id);
    await job.save();

    const populatedUser = await user.populate("appliedJobs");
    const allJobs = await Job.find();

    return res.status(201).json({
      success: true,
      message: "Your application has been removed.",
      appliedJobs: populatedUser.appliedJobs,
      allJobs,
      job,
    });
  }

  user.appliedJobs.push(jobId);
  await user.save();

  job.applications.push(id);
  await job.save();

  // Send Notification to Recruiter
  try {
    const recruiterId = job?.createdBy;
    if (recruiterId) {
      const recruiter = await User.findById(recruiterId);

      if (recruiter) {
        let notificationSchemaId = recruiter.recruiterNotification;
        
        let notificationSchema = null;
        if (notificationSchemaId) {
          notificationSchema = await Notification.findById(notificationSchemaId);
        }

        const messageText = `Student ${user?.fullname || "Someone"} applied for the job "${job?.title || "Untitled"}" at "${job?.company || "Unknown Company"}"`;
        const senderPhoto = user?.profile?.profilePhoto || "https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png";

        if (!notificationSchema) {
          const newNotification = await Notification.create({
            allMessages: [{
              message: messageText,
              time: new Date(),
              companyLogo: senderPhoto,
            }],
            newMessageCount: 1,
          });
          
          const updatedRecruiter = await User.findByIdAndUpdate(recruiterId, { recruiterNotification: newNotification._id }, { new: true });
        } else {
          notificationSchema.allMessages.push({
            message: messageText,
            time: new Date(),
            companyLogo: senderPhoto,
          });
          notificationSchema.newMessageCount += 1;
          const savedSchema = await notificationSchema.save();
        }
      }
    }
  } catch (notificationErr) {
    console.error("Something wrong");
  }

  const populatedUser = await user.populate("appliedJobs");

  const allJobs = await Job.find();

  return res.status(202).json({
    success: true,
    message: "Applied Successfully.",
    appliedJobs: populatedUser.appliedJobs,
    allJobs,
    job,
  });
};

const bookmark = async (req, res) => {
  const id = req.id;
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "User is not authenticated" });
  }

  const { jobId } = req.body;

  const job = await Job.findById(jobId);
  if (!job)
    return res.status(400).json({ success: false, message: "No Job Found." });

  const user = await User.findById(id);

  if (user.savedJobs.includes(jobId)) {
    user.savedJobs.pull(jobId);
    await user.save();

    const populatedUser = await user.populate("savedJobs");
    const allJobs = await Job.find();

    return res.status(201).json({
      success: true,
      message: "Job Unsaved",
      savedJobs: populatedUser.savedJobs,
      allJobs,
      job,
    });
  }

  user.savedJobs.push(jobId);
  await user.save();

  const populatedUser = await user.populate("savedJobs");

  const allJobs = await Job.find();

  return res.status(202).json({
    success: true,
    message: "Saved",
    savedJobs: populatedUser.savedJobs,
    allJobs,
    job,
  });
};

const remember = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId)
      .populate("createdCompanies")
      .populate("savedJobs")
      .populate("appliedJobs")
      .populate("postedJobs")
      .populate("notifications")
      .populate("recruiterNotification")
      .select("-password");

    if (!user || !user.loggedIn) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userData = user.toObject();
    if (user.role === "recruiter") {
      userData.notifications = user.recruiterNotification;
    }
    
    return res.status(200).json({
      success: true,
      user: userData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isRecruiter = user.role === "recruiter";
    const notificationId = isRecruiter ? user.recruiterNotification : user.notifications;

    if (!notificationId) {
      return res.status(200).json({
        success: true,
        message: "No notifications yet",
        notifications: {
          allMessages: [],
          newMessageCount: 0,
        },
      });
    }

    const notifications = await Notification.findByIdAndUpdate(
      notificationId,
      { $set: { newMessageCount: 0 } },
      { new: true }
    );

    if (!notifications) {
      return res.status(200).json({
        success: true,
        message: "No notifications found",
        notifications: {
          allMessages: [],
          newMessageCount: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      notifications,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


const deleteResume = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.profile.resume) {
      return res.status(400).json({
        success: false,
        message: "No resume to delete",
      });
    }

    user.profile.resume = "";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
      user,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


const createInterviewPrep = async (req, res) => {
  try {
    const { title, yearsofexperience, skills, description } = req.body;
    const id = req.id;

    const newPosition = await DashBoardPosition.create({
      Title: title,
      YearsOfExperience: yearsofexperience,
      skills,
      description,
      QuestionsWithAnswer: [],
    });

    await User.findByIdAndUpdate(
      id,
      { $push: { interviewPrep: newPosition._id } },
      { new: true }
    );

    const prompt = `
Generate 10 interview questions and answers in JSON format.

Role: ${title}
Experience: ${yearsofexperience}
Skills: ${skills}
Description: ${description}

Return format:
[
  {
    "Qs": "question here",
    "Ans": "answer here"
  }
]
`;

    const aiResponse = await aiApi(prompt);

    const parsedData = parseGeminiJSON(aiResponse);

    newPosition.QuestionsWithAnswer = parsedData;
    await newPosition.save();

    return res.status(201).json({
      success: true,
      message: "Interview prep created successfully",
      data: newPosition,
    });

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


const getInterviewPrep = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId)
      .populate("interviewPrep");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user.interviewPrep,
    });

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const deleteInterviewPrep = async (req, res) => {
  try {
    const userId = req.id;
    const { dashboardId } = req.body;

    if (!dashboardId) {
      return res.status(400).json({
        success: false,
        message: "Dashboard ID is required",
      });
    }

    const deleted = await DashBoardPosition.findByIdAndDelete(dashboardId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Dashboard not found",
      });
    }

    await User.findByIdAndUpdate(
      userId,
      { $pull: { interviewPrep: dashboardId } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Interview prep deleted successfully",
    });

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


const generateMoreQuestions = async (req, res) => {
  try {
    const { dashboardId } = req.body;

    const dashboard = await DashBoardPosition.findById(dashboardId);

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: "Dashboard not found",
      });
    }

    const previousQuestions = dashboard.QuestionsWithAnswer
      .map((q, index) => `${index + 1}. ${q.Qs}`)
      .join("\n");

    const prompt = `
You are an expert interviewer.

Generate 10 NEW interview questions and answers.

Role: ${dashboard.Title}
Experience: ${dashboard.YearsOfExperience}
Skills: ${dashboard.skills}
Description: ${dashboard.description}

Already asked questions (DO NOT repeat these):
${previousQuestions}

STRICT RULES:
- Do NOT repeat any question
- Questions must be different and unique
- Keep answers clear and structured
- Return ONLY JSON

FORMAT:
[
  {
    "Qs": "question",
    "Ans": "answer"
  }
]
`;

    const aiResponse = await aiApi(prompt);
    let parsedData = parseGeminiJSON(aiResponse);
    parsedData = parsedData.slice(0, 10);
    dashboard.QuestionsWithAnswer.push(...parsedData);

    await dashboard.save();

    return res.status(200).json({
      success: true,
      message: "10 new unique questions added",
      data: parsedData,
    });

  } catch (error) {
    console.error("Generate Qs Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate questions",
    });
  }
};
const uploadResume = async (req, res) => {
  try {
    const userId = req.id;
    const fileResume = req.file;

    if (!fileResume) {
      return res.status(400).json({ success: false, message: "No resume file provided" });
    }

    const fileResumeUri = getDataUri(fileResume);
    const fileResumeCloudResponse = await cloudinary.uploader.upload(
      fileResumeUri.content,
      {
        folder: "Job Portal Uploads/Resumes",
        resource_type: "auto",
      }
    );

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.profile.resume = fileResumeCloudResponse.secure_url;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      user,
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};


module.exports = {
  register,
  login,
  logout,
  updateProfile,
  applyJobs,
  bookmark,
  getNotifications,
  remember,
  deleteResume,
  uploadResume,
  createInterviewPrep,
  getInterviewPrep,
  deleteInterviewPrep,
  generateMoreQuestions
};