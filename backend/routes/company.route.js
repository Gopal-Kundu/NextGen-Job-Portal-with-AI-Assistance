const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const {
  registerCompany,
  getCompanyById,
  deleteCompany,
  getCompanyByName,
} = require("../controllers/company.controller");
const upload = require("../middleware/multer");

const router = express.Router();

router.post(
  "/register",
  isAuthenticated,
  upload.single("logo"),
  registerCompany
);
router.get("/get/:id", isAuthenticated, getCompanyById);
router.get("/delete/:id",isAuthenticated, deleteCompany);
router.get("/companypage/:name", getCompanyByName);
module.exports = router;
