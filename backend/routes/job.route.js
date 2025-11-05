// routes/user.route.js
const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const { postJob, getAllJobs, deleteJobById, getJobById, getApplicants } = require("../controllers/job.controller");

const router = express.Router();

router.post("/post", isAuthenticated, postJob);
router.get("/get", getAllJobs);
router.get("/get/:id", isAuthenticated, getJobById);
router.get("/delete/:id", isAuthenticated, deleteJobById);
router.get("/applicant/:id",isAuthenticated, getApplicants);
module.exports = router;
