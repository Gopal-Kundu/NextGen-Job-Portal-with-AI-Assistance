// routes/user.route.js
const express = require("express");
const {
  register,
  login,
  logout,
  updateProfile,
  applyJobs,
  bookmark,
  remember,
  getNotifications,
  deleteResume,
  uploadResume,
  createInterviewPrep,
  getInterviewPrep,
  deleteInterviewPrep,
  generateMoreQuestions,
  createJdResume,
  getJdResumes,
  getJdResumeById,
  deleteJdResume,
  analyzeExistingResumeForJd,
  generateAtsResume
} = require("../controllers/user.controller");
const upload = require("../middleware/multer");
const router = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const { allowRoles } = require("../middleware/roleMiddleware");


router.post("/register", upload.single("profilePhoto"), register);
router.post("/login", login);
router.get("/logout", isAuthenticated,logout);
router.post(
  "/profile/update",
  isAuthenticated,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateProfile
);
router.post("/apply", isAuthenticated, allowRoles("student"), applyJobs);
router.post("/bookmark", isAuthenticated, bookmark);
router.get("/remember", isAuthenticated, remember);
router.get('/notification/:userId', isAuthenticated, getNotifications);
router.get(
  "/resume/delete",
  isAuthenticated,
  deleteResume
);
router.post(
  "/resume/upload",
  isAuthenticated,
  upload.single("resume"),
  uploadResume
);
router.post("/create-interviewprep", isAuthenticated, createInterviewPrep);
router.get("/get-interviewPrep", isAuthenticated, getInterviewPrep);
router.post("/deleteInterviewPrep", isAuthenticated, deleteInterviewPrep);
router.post("/generate-more-questions", isAuthenticated, generateMoreQuestions);

// Job Description wise Resume routes
router.post("/jd-resume/create", isAuthenticated, createJdResume);
router.get("/jd-resume/all", isAuthenticated, getJdResumes);
router.get("/jd-resume/:id", isAuthenticated, getJdResumeById);
router.delete("/jd-resume/:id", isAuthenticated, deleteJdResume);
router.post("/jd-resume/:id/analyze", isAuthenticated, analyzeExistingResumeForJd);
router.post("/jd-resume/:id/generate", isAuthenticated, generateAtsResume);

module.exports = router;