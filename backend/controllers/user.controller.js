const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getDataUri = require("../utils/datauri");
const cloudinary = require("../utils/cloudinary");
const Job = require("../models/job.model");
require("dotenv").config({ quiet: true });

// REGISTER
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

// LOGIN
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

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "2d",
    });

    await user.populate("createdCompanies");
    await user.populate("savedJobs");
    await user.populate("postedJobs");
    await user.populate("appliedJobs");

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
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: false,
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

// LOGOUT
const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
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
      .populate("postedJobs");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const allJobs = await Job.find();
    return res.status(200).json({
      success: true,
      user,
      allJobs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

module.exports = { register, login, logout, updateProfile, applyJobs, bookmark, remember };
