// routes/user.route.js
const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const { postJob, getAllJobs, getAdminJobs } = require("../controllers/job.controller");

const router = express.Router();

router.post("/post", isAuthenticated, postJob);
router.get("/get", getAllJobs);
router.get("/get/:id", isAuthenticated, getAdminJobs);

module.exports = router;
