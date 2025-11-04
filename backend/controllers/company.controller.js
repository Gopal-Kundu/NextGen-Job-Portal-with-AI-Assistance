const Company = require("../models/company.model"); // adjust the path to your Company model
const User = require("../models/user.model");
const getDataUri = require("../utils/datauri");
const cloudinary = require("../utils/cloudinary");

const registerCompany = async (req, res) => {
  try {
    const { companyName, description, website, location } = req.body;

    const logo  = req.file;

    let logoPicResponse = "";

    if (logo) {
      const logoPicUri = getDataUri(logo);
      logoPicResponse = await cloudinary.uploader.upload(logoPicUri.content, {
        folder: "Job Portal Uploads/Company logo",
        resource_type: "auto",
      });
    }

    if (!companyName || companyName.trim() === "") {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }


    const existingCompany = await Company.findOne({ name: companyName });
    if (existingCompany) {
      return res.status(400).json({
        message: "You can't add same company",
        success: false,
      });
    }


    const newCompany = await Company.create({
      name: companyName,
      userId: req.id,
      description,
      logo : logoPicResponse.secure_url,
      location,
      website,
    });
    
    const user = await User.findById(req.id);
    user.createdCompanies.push(newCompany._id);
    await user.save();
    await user.populate("createdCompanies");

    return res.status(201).json({
      message: "Company registered successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in registerCompany:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const getCompany = async (req, res) => {
  try {
    const userId = req.id; 
    const company = await Company.findOne({ userId });
    if (!company) {
      return res.status(404).json({
        message: "Companies not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      company: {
        name: company.name,
      },
    });
  } catch (error) {
    console.error("Error in getCompany:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params; 
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error("Error in getCompanyById:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file; 
    const updateData = { name, description, website, location };
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company information updated",
      success: true,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error in updateCompany:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
};
