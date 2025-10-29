const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
} = require("../controllers/company.controller");
const upload = require("../middleware/multer");

const router = express.Router();

router.post(
  "/register",
  isAuthenticated,
  upload.single("logo"),
  registerCompany
);
router.get("/get", isAuthenticated, getCompany);
router.get("/get/:id", isAuthenticated, getCompanyById);
router.post("/update/:id", isAuthenticated, updateCompany);

module.exports = router;
