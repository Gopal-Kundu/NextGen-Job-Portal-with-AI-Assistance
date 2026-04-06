// routes/user.route.js
const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const { postJob, getAllJobs, deleteJobById, getJobById, getApplicants, searchJobs, approve, reject , applyFilter, getTrendingJobs } = require("../controllers/job.controller");
const { aiApi } = require("../controllers/ai.controller");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/post", isAuthenticated, allowRoles("recruiter"), postJob);
router.get("/get", getAllJobs);
router.get("/get/:id", getJobById);
router.get("/delete/:id", isAuthenticated, allowRoles("recruiter"), deleteJobById);
router.get("/applicant/:id",isAuthenticated, allowRoles("recruiter"), getApplicants);
router.get("/search", searchJobs);
router.post("/approve/:id", isAuthenticated, allowRoles("recruiter"), approve);
router.post("/reject/:id", isAuthenticated, allowRoles("recruiter"), reject);
router.post("/filter/:pageno", applyFilter);
router.get("/trending", getTrendingJobs);

router.post("/ai", aiApi);
module.exports = router;
