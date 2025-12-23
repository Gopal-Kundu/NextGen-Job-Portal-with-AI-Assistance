require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./utils/db");
const userRoute = require("./routes/user.route");
const companyRoute = require("./routes/company.route");
const jobRoute = require("./routes/job.route");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.SERVER_PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,   
  max: 100,                   
  message: "Too many requests, try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter)

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to MongoDB", err);
});
