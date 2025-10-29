const Application = require("../models/application.model");
const Job = require("../models/job.model");

const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const {jobId} = req.params;
    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required.",
        success: false,
      });
    }

    //Check if the job exists
    const job = await Job.find({_id: jobId});
    if (!job) {
      return res.status(400).json({
        message: "Job not found",
        success: false,
      });
    }

    //Checked user has already applied for the job.
    const existingApplication = await Application.findOne({
      _id: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({ 
        message: "You have already applied for this Jobs.",
        success: false,
      });
    }

    //Create applicatiion
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(200).json({
      message: "Job applied Successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
      success: false,
    });
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
        },
      });
    if (!application)
      return res.status(404).json({
        message: "No Applications",
        success: false,
      });

    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
      success: false,
    });
  }
};

const getApplicants = async (req, res) => {
  try {
    const jobId  = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Server Error",
      success: false,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }

    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    application.status = status.toLowerCase();
    await application.save();
    return res.status(200).json({
      message: "status updated successfully",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Server error",
      success: "false",
    });
  }
};

module.exports = { applyJob, getAppliedJobs, getApplicants, updateStatus };
