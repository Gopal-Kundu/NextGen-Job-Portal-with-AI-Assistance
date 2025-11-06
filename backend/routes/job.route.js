// routes/user.route.js
const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const { postJob, getAllJobs, deleteJobById, getJobById, getApplicants, searchJobs, approve, reject } = require("../controllers/job.controller");

const router = express.Router();

router.post("/post", isAuthenticated, postJob);
router.get("/get", getAllJobs);
router.get("/get/:id", getJobById);
router.get("/delete/:id", isAuthenticated, deleteJobById);
router.get("/applicant/:id",isAuthenticated, getApplicants);
router.get("/search", searchJobs);
router.post("/approve/:id", isAuthenticated, approve);
router.post("/reject/:id", isAuthenticated, reject);
module.exports = router;
