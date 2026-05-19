import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Sparkles, BrainCircuit, AlertCircle, RefreshCw, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import JobCard from "./Jobcard";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Skeleton from "@mui/material/Skeleton";
import { JOB_API_END_POINT } from "@/utils/address";
import { setUser } from "@/redux/authSlice";

export default function AiRecommendations() {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRefreshClick = () => {
    if (!user) {
      toast.error("Please login to access AI recommendations.", {
        position: "top-center",
      });
      navigate("/login");
    } else {
      fetchAiRecommendations(true);
    }
  };

  const handleAddSkillsClick = () => {
    if (!user) {
      toast.error("Please login first to add skills.", {
        position: "top-center",
      });
      navigate("/login");
    } else {
      navigate("/profile");
    }
  };

  const handleUploadResumeClick = () => {
    if (!user) {
      toast.error("Please login first to upload resume.", {
        position: "top-center",
      });
      navigate("/login");
    } else {
      navigate("/resumepage");
    }
  };

  const fetchAiRecommendations = async (isRefresh = false) => {
    if (!user) return;
    setLoadingJobs(true);
    try {
      const res = await axios.post(
        `${JOB_API_END_POINT}/getRecomendation`,
        {
          skills: user?.profile?.skills === "Not specified" ? "" : user?.profile?.skills,
          resumeLink: user?.profile?.resume,
          refresh: isRefresh
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setJobs(res.data.jobs || []);
        
        // Push recomend jobs to user in redux
        if (res.data.jobs) {
          const newIds = res.data.jobs.map(j => j._id);
          const updatedRecomend = [...(user.recomend || [])];
          newIds.forEach(id => {
            if (!updatedRecomend.includes(id)) updatedRecomend.push(id);
          });
          
          dispatch(setUser({
            ...user,
            recomend: updatedRecomend
          }));
        }

        if (isRefresh) {
          toast.success("AI recommendations refreshed and updated!", {
            position: "top-center",
          });
        }
      }
    } catch (error) {
      console.error(error);
      // If profile is incomplete
      const msg = error.response?.data?.message || "Failed to fetch AI recommendations.";
      toast.error(msg, {
        position: "top-center",
      });
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAiRecommendations(false);
    }
  }, [user?._id]);

  const hasProfileData = 
    (user?.profile?.skills && user?.profile?.skills !== "Not specified" && user?.profile?.skills.trim() !== "") || 
    (user?.profile?.resume && user?.profile?.resume.trim() !== "");

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <div className="h-full flex items-center">
          <Sidebar highlightIndex={7} />
          <Navbar />
        </div>

        {/* AI Header Hero Banner */}
        <div className="bg-gradient-to-r from-violet-600 via-indigo-700 to-purple-800 text-white py-12 px-8 relative overflow-hidden shadow-lg select-none">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-6">
            <BrainCircuit size={320} />
          </div>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-3 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles size={14} className="animate-pulse text-amber-300" /> Powered by Gemini AI
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                AI Job Recommendations
              </h1>
              <p className="text-indigo-100 max-w-xl text-lg font-light leading-relaxed">
                Our advanced AI analyzes your skills, experience, and uploaded resume to recommend matching career opportunities that align with your profile.
              </p>
            </div>
            
            {hasProfileData && (
              <button
                onClick={handleRefreshClick}
                disabled={loadingJobs}
                className="flex items-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-full font-bold shadow-md hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50 select-none cursor-pointer"
                id="btn-refresh-ai-jobs"
              >
                <RefreshCw size={18} className={loadingJobs ? "animate-spin" : ""} />
                Refresh Matches
              </button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          {!hasProfileData ? (
            // Incomplete Profile Call to Action
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto text-center border border-gray-100 mt-8">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
                <AlertCircle size={36} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Complete Your Profile</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                AI recommendations require skills or a resume. Update your profile so Gemini AI can scan your credentials and discover matching roles.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleAddSkillsClick}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  id="btn-go-to-profile-skills"
                >
                  Add Skills <ArrowRight size={18} />
                </button>
                <button
                  onClick={handleUploadResumeClick}
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  id="btn-go-to-resume-upload"
                >
                  <FileText size={18} /> Upload Resume
                </button>
              </div>
            </div>
          ) : (
            // Recommendations List
            <div>
              <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <BrainCircuit className="text-violet-600" /> Customized For Your Profile
                </h3>
                {jobs.length > 0 && !loadingJobs && (
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {jobs.length} Matching Roles Found
                  </span>
                )}
              </div>

              <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                  {loadingJobs ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-white p-5 rounded-xl shadow-lg w-full flex flex-col gap-4"
                      >
                        <Skeleton variant="text" width="60%" height={20} />
                        <div className="flex items-center gap-4">
                          <Skeleton variant="rounded" width={56} height={56} />
                          <div className="flex-1">
                            <Skeleton variant="text" width="80%" height={25} />
                            <Skeleton variant="text" width="60%" height={20} />
                          </div>
                        </div>
                        <Skeleton variant="text" width="100%" height={60} />
                        <Skeleton variant="rounded" width="100%" height={70} />
                        <div className="grid grid-cols-3 gap-3 mt-3">
                          <Skeleton variant="rounded" height={36} />
                          <Skeleton variant="rounded" height={36} />
                          <Skeleton variant="rounded" height={36} />
                        </div>
                      </div>
                    ))
                  ) : jobs.length === 0 ? (
                    <div className="col-span-full bg-white text-center py-16 px-4 rounded-2xl shadow-md border border-gray-100">
                      <Sparkles size={48} className="mx-auto text-indigo-400 mb-4" />
                      <h4 className="text-xl font-bold text-gray-800 mb-2">No Matching Jobs Available</h4>
                      <p className="text-gray-500 max-w-md mx-auto">
                        We couldn't find any job openings matching your profile titles right now. Try updating your skills or uploading a detailed resume to broaden your recommendation tags.
                      </p>
                    </div>
                  ) : (
                    jobs.map((job, idx) => (
                      <JobCard
                        key={idx}
                        id={job._id}
                        jobType={job.jobType}
                        salary={job.salary}
                        vacancy={job.vacancy}
                        description={job.description}
                        location={job.location}
                        companyName={job.company}
                        role={job.title}
                        datePosted={job.createdAt}
                        companyLogo={job.logo}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
