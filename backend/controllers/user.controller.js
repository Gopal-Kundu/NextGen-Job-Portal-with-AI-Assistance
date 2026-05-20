const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getDataUri = require("../utils/datauri");
const cloudinary = require("../utils/cloudinary");
const Job = require("../models/job.model");
const Notification = require("../models/notification.model");
const DashBoardPosition = require("../models/dashboard.model");
const JobDescriptionWiseResume = require("../models/jobDescriptionWiseResume.model");
const { extractText, getDocumentProxy } = require("unpdf");

const { aiApi, parseGeminiJSON } = require("./ai.controller");
require("dotenv").config({ quiet: true });

// Helper to fetch and extract text from a PDF URL
const extractTextFromPdf = async (url) => {
  const buffer = await fetch(url).then(res => res.arrayBuffer());
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return text;
};


const register = async (req, res) => {
  try {
    const { fullname, email, phonenumber, password, role } = req.body;

    if (!fullname || !email || !phonenumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required. Please fill in every field.",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "An account with this email already exists. Please login instead.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phonenumber,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "Account created successfully! Please login to continue.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Please try again later.", success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password and role are all required.",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "No account found with this email. Please sign up first.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect password. Please try again.",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: `This account is registered as a ${user.role}. Please select the correct role.`,
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
      role: user.role
    };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "2d",
    });
    user.loggedIn = true;
    await user.save();
    await user.populate("createdCompanies");
    await user.populate("savedJobs");
    await user.populate("postedJobs");
    await user.populate("appliedJobs");
    await user.populate("notifications");
    await user.populate("recruiterNotification");
    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      createdCompanies: user.createdCompanies,
      phonenumber: user.phonenumber,
      role: user.role,
      profile: user.profile,
      savedJobs: user.savedJobs,
      postedJobs: user.postedJobs,
      appliedJobs: user.appliedJobs,
      notifications: user.role === "recruiter" ? user.recruiterNotification : user.notifications,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: userData,
        success: true,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const logout = async (req, res) => {
  try {
    let user = await User.findById(req.id);
    user.loggedIn = false;
    await user.save();
    res.status(200).clearCookie("token", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    }).json({
      message: "Logged Out Successfully",
      success: true,
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const updateProfile = async (req, res) => {
  const { fullname, role, phonenumber, bio, skills } = req.body;

  const fileResume = req.files?.resume?.[0];
  const profilePhoto = req.files?.profilePhoto?.[0];

  let fileResumeCloudResponse;
  let profilePhotoCloudResponse;

  try {
    if (fileResume) {
      const fileResumeUri = getDataUri(fileResume);
      fileResumeCloudResponse = await cloudinary.uploader.upload(
        fileResumeUri.content,
        {
          folder: "Job Portal Uploads/Resumes",
          resource_type: "auto",
        }
      );
    }

    if (profilePhoto) {
      const fileProfilePhotoUri = getDataUri(profilePhoto);
      profilePhotoCloudResponse = await cloudinary.uploader.upload(
        fileProfilePhotoUri.content,
        {
          folder: "Job Portal Uploads/Profile Photos",
          resource_type: "auto",
        }
      );
    }

    const user = await User.findById(req.id);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    if (fullname) user.fullname = fullname;
    if (role) user.role = role;
    if (phonenumber) user.phonenumber = phonenumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills;

    if (profilePhotoCloudResponse) {
      user.profile.profilePhoto = profilePhotoCloudResponse.secure_url;
    }
    if (fileResumeCloudResponse) {
      user.profile.resume = fileResumeCloudResponse.secure_url;
    }

    await user.save();

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

const applyJobs = async (req, res) => {
  const id = req.id;
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "User is not authenticated" });
  }

  const { jobId } = req.body;

  const job = await Job.findById(jobId);
  if (!job)
    return res.status(400).json({ success: false, message: "No Job Found." });

  const user = await User.findById(id);

  if (user.appliedJobs.includes(jobId)) {
    user.appliedJobs.pull(jobId);
    await user.save();
    job.applications.pull(id);
    await job.save();

    const populatedUser = await user.populate("appliedJobs");
    const allJobs = await Job.find();

    return res.status(201).json({
      success: true,
      message: "Your application has been removed.",
      appliedJobs: populatedUser.appliedJobs,
      allJobs,
      job,
    });
  }

  user.appliedJobs.push(jobId);
  await user.save();

  job.applications.push(id);
  await job.save();

  // Send Notification to Recruiter
  try {
    const recruiterId = job?.createdBy;
    if (recruiterId) {
      const recruiter = await User.findById(recruiterId);

      if (recruiter) {
        let notificationSchemaId = recruiter.recruiterNotification;
        
        let notificationSchema = null;
        if (notificationSchemaId) {
          notificationSchema = await Notification.findById(notificationSchemaId);
        }

        const messageText = `Student ${user?.fullname || "Someone"} applied for the job "${job?.title || "Untitled"}" at "${job?.company || "Unknown Company"}"`;
        const senderPhoto = user?.profile?.profilePhoto || "https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png";

        if (!notificationSchema) {
          const newNotification = await Notification.create({
            allMessages: [{
              message: messageText,
              time: new Date(),
              companyLogo: senderPhoto,
            }],
            newMessageCount: 1,
          });
          
          const updatedRecruiter = await User.findByIdAndUpdate(recruiterId, { recruiterNotification: newNotification._id }, { returnDocument: 'after' });
        } else {
          notificationSchema.allMessages.push({
            message: messageText,
            time: new Date(),
            companyLogo: senderPhoto,
          });
          notificationSchema.newMessageCount += 1;
          const savedSchema = await notificationSchema.save();
        }
      }
    }
  } catch (notificationErr) {
    console.error("Something wrong");
  }

  const populatedUser = await user.populate("appliedJobs");

  const allJobs = await Job.find();

  return res.status(202).json({
    success: true,
    message: "Applied Successfully.",
    appliedJobs: populatedUser.appliedJobs,
    allJobs,
    job,
  });
};

const bookmark = async (req, res) => {
  const id = req.id;
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "User is not authenticated" });
  }

  const { jobId } = req.body;

  const job = await Job.findById(jobId);
  if (!job)
    return res.status(400).json({ success: false, message: "No Job Found." });

  const user = await User.findById(id);

  if (user.savedJobs.includes(jobId)) {
    user.savedJobs.pull(jobId);
    await user.save();

    const populatedUser = await user.populate("savedJobs");
    const allJobs = await Job.find();

    return res.status(201).json({
      success: true,
      message: "Job Unsaved",
      savedJobs: populatedUser.savedJobs,
      allJobs,
      job,
    });
  }

  user.savedJobs.push(jobId);
  await user.save();

  const populatedUser = await user.populate("savedJobs");

  const allJobs = await Job.find();

  return res.status(202).json({
    success: true,
    message: "Saved",
    savedJobs: populatedUser.savedJobs,
    allJobs,
    job,
  });
};

const remember = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId)
      .populate("createdCompanies")
      .populate("savedJobs")
      .populate("appliedJobs")
      .populate("postedJobs")
      .populate("notifications")
      .populate("recruiterNotification")
      .select("-password");

    if (!user || !user.loggedIn) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userData = user.toObject();
    if (user.role === "recruiter") {
      userData.notifications = user.recruiterNotification;
    }
    
    return res.status(200).json({
      success: true,
      user: userData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isRecruiter = user.role === "recruiter";
    const notificationId = isRecruiter ? user.recruiterNotification : user.notifications;

    if (!notificationId) {
      return res.status(200).json({
        success: true,
        message: "No notifications yet",
        notifications: {
          allMessages: [],
          newMessageCount: 0,
        },
      });
    }

    const notifications = await Notification.findByIdAndUpdate(
      notificationId,
      { $set: { newMessageCount: 0 } },
      { returnDocument: 'after' }
    );

    if (!notifications) {
      return res.status(200).json({
        success: true,
        message: "No notifications found",
        notifications: {
          allMessages: [],
          newMessageCount: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      notifications,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


const deleteResume = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.profile.resume) {
      return res.status(400).json({
        success: false,
        message: "No resume to delete",
      });
    }

    user.profile.resume = "";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
      user,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


const createInterviewPrep = async (req, res) => {
  try {
    const { title, yearsofexperience, skills, description } = req.body;
    const id = req.id;

    const newPosition = await DashBoardPosition.create({
      Title: title,
      YearsOfExperience: yearsofexperience,
      skills,
      description,
      QuestionsWithAnswer: [],
    });

    await User.findByIdAndUpdate(
      id,
      { $push: { interviewPrep: newPosition._id } },
      { returnDocument: 'after' }
    );

    const prompt = `
Generate 10 interview questions and answers in JSON format.

Role: ${title}
Experience: ${yearsofexperience}
Skills: ${skills}
Description: ${description}

Return format:
[
  {
    "Qs": "question here",
    "Ans": "answer here"
  }
]
`;

    const aiResponse = await aiApi(prompt);

    const parsedData = parseGeminiJSON(aiResponse);

    newPosition.QuestionsWithAnswer = parsedData;
    await newPosition.save();

    return res.status(201).json({
      success: true,
      message: "Interview prep created successfully",
      data: newPosition,
    });

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


const getInterviewPrep = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId)
      .populate("interviewPrep");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user.interviewPrep,
    });

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const deleteInterviewPrep = async (req, res) => {
  try {
    const userId = req.id;
    const { dashboardId } = req.body;

    if (!dashboardId) {
      return res.status(400).json({
        success: false,
        message: "Dashboard ID is required",
      });
    }

    const deleted = await DashBoardPosition.findByIdAndDelete(dashboardId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Dashboard not found",
      });
    }

    await User.findByIdAndUpdate(
      userId,
      { $pull: { interviewPrep: dashboardId } },
      { returnDocument: 'after' }
    );

    return res.status(200).json({
      success: true,
      message: "Interview prep deleted successfully",
    });

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


const generateMoreQuestions = async (req, res) => {
  try {
    const { dashboardId } = req.body;

    const dashboard = await DashBoardPosition.findById(dashboardId);

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: "Dashboard not found",
      });
    }

    const previousQuestions = dashboard.QuestionsWithAnswer
      .map((q, index) => `${index + 1}. ${q.Qs}`)
      .join("\n");

    const prompt = `
You are an expert interviewer.

Generate 10 NEW interview questions and answers.

Role: ${dashboard.Title}
Experience: ${dashboard.YearsOfExperience}
Skills: ${dashboard.skills}
Description: ${dashboard.description}

Already asked questions (DO NOT repeat these):
${previousQuestions}

STRICT RULES:
- Do NOT repeat any question
- Questions must be different and unique
- Keep answers clear and structured
- Return ONLY JSON

FORMAT:
[
  {
    "Qs": "question",
    "Ans": "answer"
  }
]
`;

    const aiResponse = await aiApi(prompt);
    let parsedData = parseGeminiJSON(aiResponse);
    parsedData = parsedData.slice(0, 10);
    dashboard.QuestionsWithAnswer.push(...parsedData);

    await dashboard.save();

    return res.status(200).json({
      success: true,
      message: "10 new unique questions added",
      data: parsedData,
    });

  } catch (error) {
    console.error("Generate Qs Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate questions",
    });
  }
};
const uploadResume = async (req, res) => {
  try {
    const userId = req.id;
    const fileResume = req.file;

    if (!fileResume) {
      return res.status(400).json({ success: false, message: "No resume file provided" });
    }

    const fileResumeUri = getDataUri(fileResume);
    const fileResumeCloudResponse = await cloudinary.uploader.upload(
      fileResumeUri.content,
      {
        folder: "Job Portal Uploads/Resumes",
        resource_type: "auto",
      }
    );

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.profile.resume = fileResumeCloudResponse.secure_url;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      user,
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

const createJdResume = async (req, res) => { //This is for create folder on JD page
  try {
    const { companyName, jobDescription } = req.body;
    const userId = req.id;

    if (!companyName || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Company name and job description are required",
      });
    }

    const newJdResume = await JobDescriptionWiseResume.create({
      companyName,
      jobDescription,
      userId,
    });

    await User.findByIdAndUpdate(
      userId,
      { $push: { jobDescriptionWiseResume: newJdResume._id } },
      { returnDocument: 'after' }
    );

    return res.status(201).json({
      success: true,
      message: "Job description entry created successfully",
      data: newJdResume,
    });
  } catch (error) {
    console.error("Error creating JD resume:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getJdResumes = async (req, res) => {
  try {
    const userId = req.id;
    const resumes = await JobDescriptionWiseResume.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    console.error("Error fetching JD resumes:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getJdResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await JobDescriptionWiseResume.findById(id);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Job Description wise resume entry not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error("Error fetching JD resume by id:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteJdResume = async (req, res) => {
  try {
    const userId = req.id;
    const { id } = req.params;

    const deleted = await JobDescriptionWiseResume.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Job Description wise resume entry not found",
      });
    }

    await User.findByIdAndUpdate(
      userId,
      { $pull: { jobDescriptionWiseResume: id } },
      { returnDocument: 'after' }
    );

    return res.status(200).json({
      success: true,
      message: "Job description entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting JD resume:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const analyzeExistingResumeForJd = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    const jdResume = await JobDescriptionWiseResume.findById(id);
    if (!jdResume) {
      return res.status(404).json({
        success: false,
        message: "Job description entry not found",
      });
    }

    const user = await User.findById(userId);
    if (!user || !user.profile.resume) {
      return res.status(400).json({
        success: false,
        message: "NO_RESUME",
      });
    }

    // Extract text from the existing user resume
    const rawResumeText = await extractTextFromPdf(user.profile.resume);
    // Truncate to avoid Gemini token overflow (500 Internal Error)
    const resumeText = rawResumeText.slice(0, 3000);
    const jobDescText = jdResume.jobDescription.slice(0, 2000);

    const prompt = `
You are an expert ATS (Applicant Tracking System) parser and career coach.
Analyze the user's resume against the target Job Description.

User Resume Text:
${resumeText}

Job Description:
${jobDescText}

Provide a detailed evaluation in JSON format:
{
  "atsScore": 75,
  "weakSpots": "List of areas where the resume is lacking skills, keywords, or structure relative to the job description."
}

Return ONLY raw JSON. Do not include markdown code block styling like \`\`\`json or \`\`\`.
`;

    const aiResponse = await aiApi(prompt);
    const parsed = parseGeminiJSON(aiResponse);

    jdResume.initialATSScore = parsed.atsScore ?? 0;
    const weakSpots = parsed.weakSpots ?? "None identified.";
    jdResume.WeakSpotInResume = weakSpots;
    
    // SECOND API CALL: Dedicated explicitly for generating highly detailed learning recommendations
    const learningPrompt = `
You are an elite Tech Career Coach. Based on the following weak spots identified in a candidate's resume for a specific job, recommend highly detailed YouTube searches to bridge the gap.

Job Description:
${jobDescText}

Identified Weak Spots:
${weakSpots}

CRITICAL: Do NOT focus on generic paid courses. Focus heavily on YouTube. You MUST provide at least 10-15 highly specific YouTube search titles/queries that the candidate can search to learn these exact skills.

Return ONLY raw JSON. Do not include markdown code block styling.
{
  "recommendedYoutubeSearchesAndCourses": "Provide a highly detailed, markdown-formatted list of 10-15 YouTube searches. Use numbers and bullets. Format exactly like this:\\n\\n### Recommended Courses\\n1. **[Course Name]** on [Platform] - *[1-sentence reason]*\\n\\n### What to Search on YouTube (10-15 exact queries)\\n1. **\\\"[Exact Search Query 1]\\\"** - *[Detailed explanation of what this will teach you and why it is vital for this specific job description]*\\n2. **\\\"[Exact Search Query 2]\\\"** - *[Detailed explanation]*"
}
`;

    const learningResponse = await aiApi(learningPrompt);
    const learningParsed = parseGeminiJSON(learningResponse);

    // Ensure it's a string even if Gemini returns an array
    let recommended = learningParsed.recommendedYoutubeSearchesAndCourses || "None recommended.";
    if (Array.isArray(recommended)) {
      recommended = recommended.join('\\n');
    }
    jdResume.recomendedYoutubeSearchesAndCourses = recommended;
    await jdResume.save();

    return res.status(200).json({
      success: true,
      message: "Analysis completed successfully",
      data: jdResume,
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during analysis",
      error: error.message,
    });
  }
};

const generateAtsResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    const jdResume = await JobDescriptionWiseResume.findById(id);
    if (!jdResume) {
      return res.status(404).json({
        success: false,
        message: "Job description entry not found",
      });
    }

    const user = await User.findById(userId);
    if (!user || !user.profile.resume) {
      return res.status(400).json({
        success: false,
        message: "NO_RESUME",
      });
    }

    const rawResumeText = await extractTextFromPdf(user.profile.resume);
    const resumeText = rawResumeText.slice(0, 3000);
    const jobDescText = jdResume.jobDescription.slice(0, 2000);

    // Ask Gemini for structured JSON resume data (no LaTeX/binary deps needed)
    const jsonPrompt = `You are a world-class Executive Resume Writer and ATS (Applicant Tracking System) Expert.
Your objective is to completely overhaul and tailor the candidate's existing resume to flawlessly match the target Job Description, aiming for a 95+ ATS score.

Existing Resume Text:
${resumeText}

Target Job Description:
${jobDescText}

CRITICAL INSTRUCTIONS:
1. DEEP KEYWORD INTEGRATION: Analyze the Job Description for hard skills, soft skills, tools, methodologies, and exact phrasing. Embed these exact keywords naturally throughout the Summary, Skills, and Experience bullets.
2. ACTION-ORIENTED BULLETS: Rewrite experience bullets using strong action verbs. Quantify achievements (e.g., increased by X%, managed $Y budget) wherever plausible based on the original text.
3. SKILL REORGANIZATION: Reorder and categorize the skills section to exactly mirror the requirements prioritized in the JD.
4. SUMMARY REVAMP: Craft a high-impact, 3-sentence professional summary that immediately positions the candidate as the perfect fit for this specific role, heavily utilizing JD keywords.
5. NO HALLUCINATIONS: Do not invent new jobs or degrees. Only enhance and rephrase existing experience to highlight relevance to the JD.
6. STRICT ONE-PAGE LIMIT (CONCISENESS): The generated content MUST fit on a single A4 page. Be extremely concise. Limit to the 2-3 most relevant experiences (max 2-3 bullets each) and top 2 projects (max 2-4 bullets each). Delete older or irrelevant filler completely.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "name": "Candidate Full Name",
  "contact": { "phone": "+91-XXXXXXXXXX", "email": "email@example.com", "linkedin": "linkedin.com/in/profile", "github": "github.com/username", "portfolio": "" },
  "summary": "High-impact summary saturated with JD keywords.",
  "skills": [
    { "category": "Languages", "items": "Python, JavaScript, Java" }
  ],
  "experience": [
    { "company": "Company", "location": "City", "role": "Role", "dates": "Month Year – Month Year", "bullets": ["Action-driven bullet with metrics and JD keywords"] }
  ],
  "projects": [
    { "name": "Project", "technologies": "React, Node.js", "bullets": ["Keyword-rich description"] }
  ],
  "achievements": ["Achievement 1"],
  "education": [
    { "institution": "University", "location": "City", "degree": "B.Tech CS | CGPA: X.X", "dates": "Month Year – Month Year" }
  ]
}`;

    const rawJson = await aiApi(jsonPrompt);
    const resumeData = parseGeminiJSON(rawJson);

    // ATS evaluation using the structured JSON content
    const evaluationPrompt = `You are an expert ATS parser and HR Recruiter. Evaluate this highly-tailored resume JSON against the job description.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Job Description:
${jdResume.jobDescription}

Since this resume was just specifically tailored for this JD using deep keyword integration, your goal is to award an ATS score of 95-100%. Evaluate strictly but fairly based on the presence of JD keywords in the Resume Data.

Return ONLY raw JSON with this exact structure (no markdown formatting outside the string values):
{ 
  "atsScore": 98, 
  "weakSpots": "Any remaining minor gaps or missing extremely specific niche tools."
}`;

    const evalResponse = await aiApi(evaluationPrompt);
    const parsedEval = parseGeminiJSON(evalResponse);

    jdResume.AtsResumeJson = JSON.stringify(resumeData, null, 2);
    jdResume.ATSScoreOfResume = parsedEval.atsScore ?? 0;
    const finalWeakSpots = parsedEval.weakSpots ?? "None identified.";
    jdResume.WeakSpotInResume = finalWeakSpots;
    
    // SECOND API CALL: Dedicated explicitly for generating highly detailed learning recommendations
    const learningPrompt = `
You are an elite Tech Career Coach. Based on the following weak spots identified in a candidate's highly-tailored resume for a specific job, recommend highly detailed YouTube searches to bridge the gap.

Job Description:
${jdResume.jobDescription}

Identified Weak Spots:
${finalWeakSpots}

CRITICAL: Do NOT focus on generic paid courses. Focus heavily on YouTube. You MUST provide at least 10-30 highly specific YouTube search titles/queries that the candidate can search to learn these exact skills.

Return ONLY raw JSON. Do not include markdown code block styling.
{
  "recommendedYoutubeSearchesAndCourses": "Provide a highly detailed, markdown-formatted list of 10-15 YouTube searches to bridge the remaining gaps. Use numbers and bullets. Format exactly like this:\\n\\n### Recommended Courses\\n1. **[Course Name]** on [Platform] - *[1-sentence reason]*\\n\\n### What to Search on YouTube (10-15 exact queries)\\n1. **\\\"[Exact Search Query 1]\\\"** - *[Detailed explanation of what this will teach you and why it is vital for this specific job description]*\\n2. **\\\"[Exact Search Query 2]\\\"** - *[Detailed explanation]*" 
}
`;

    const learningResponse = await aiApi(learningPrompt);
    const learningParsed = parseGeminiJSON(learningResponse);

    let recommended = learningParsed.recommendedYoutubeSearchesAndCourses || "None recommended.";
    if (Array.isArray(recommended)) {
      recommended = recommended.join('\\n');
    }
    jdResume.recomendedYoutubeSearchesAndCourses = recommended;
    await jdResume.save();

    return res.status(200).json({
      success: true,
      message: "Tailored ATS Resume created successfully",
      data: jdResume,
    });
  } catch (error) {
    console.error("Error generating ATS resume:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during ATS resume generation",
      error: error.message,
    });
  }
};


module.exports = {
  register,
  login,
  logout,
  updateProfile,
  applyJobs,
  bookmark,
  getNotifications,
  remember,
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
};