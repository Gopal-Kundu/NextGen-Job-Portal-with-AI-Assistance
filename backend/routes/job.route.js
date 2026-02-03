// routes/user.route.js
const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const { postJob, getAllJobs, deleteJobById, getJobById, getApplicants, searchJobs, approve, reject , applyFilter, getTrendingJobs } = require("../controllers/job.controller");
const { aiApi } = require("../controllers/ai.controller");

const router = express.Router();

router.post("/post", isAuthenticated, postJob);
router.get("/get", getAllJobs);
router.get("/get/:id", getJobById);
router.get("/delete/:id", isAuthenticated, deleteJobById);
router.get("/applicant/:id",isAuthenticated, getApplicants);
router.get("/search", searchJobs);
router.post("/approve/:id", isAuthenticated, approve);
router.post("/reject/:id", isAuthenticated, reject);
router.post("/filter/:pageno", applyFilter);
router.get("/trending", getTrendingJobs);

router.post("/ai", aiApi);
module.exports = router;
