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
} = require("../controllers/user.controller");
const upload = require("../middleware/multer");
const router = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");


router.post("/register", upload.single("profilePhoto"), register);
router.post("/login", login);
router.get("/logout", isAuthenticated ,logout);
router.post(
  "/profile/update",
  isAuthenticated,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateProfile
);
router.post("/apply", isAuthenticated, applyJobs);
router.post("/bookmark", isAuthenticated, bookmark);
router.get("/remember", isAuthenticated, remember);
module.exports = router;
