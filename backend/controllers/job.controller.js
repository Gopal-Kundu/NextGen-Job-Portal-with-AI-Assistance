const Company = require("../models/company.model");
const Job = require("../models/job.model");
const User = require("../models/user.model");

const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      company,
      vacancy,
    } = req.body;
    const userId = req.id;
    if (!userId) {
      return res.status(400).json({
        message: "Unauthenticated user",
        success: false,
      });
    }
    const companyData = await Company.findOne({
      name: { $regex: `^${company}$`, $options: "i" },
    });

    const job = await Job.create({
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      vacancy,
      company,
      logo: companyData?.logo || "https://media.wired.com/photos/65e88c25b8b2544099643d3d/master/w_1600,c_limit/aaaoriginal.jpg",
      createdBy: userId,
      applications: [],
    });
    const user = await User.findById(userId);
    user.postedJobs.push(job._id);
    await user.save();
    await user.populate("postedJobs");
    await user.populate("appliedJobs");
    await user.populate("savedJobs");
    await user.populate("createdCompanies");
    return res.status(201).json({
      message: "Job posted successfully",
      success: true,
      job,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
      success: false,
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const { keyword } = req.query;

    const query = keyword
      ? {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};

    const jobs = await Job.find(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteJobById = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    await Job.findByIdAndDelete(jobId);

    await User.updateOne(
      { _id: userId },
      { $pull: { postedJobs: jobId } }
    );

    await User.updateMany(
      { savedJobs: jobId },
      { $pull: { savedJobs: jobId } }
    );

    await User.updateMany(
      { appliedJobs: jobId },
      { $pull: { appliedJobs: jobId } }
    );

    return res.status(200).json({
      message: "Job Deleted Successfully",
      success: true,
    });

  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Failed to delete Job",
      success: false,
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const {id} = req.params;
    const job = await Job.find({_id: id});

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { postJob, getAllJobs, getJobById, deleteJobById };