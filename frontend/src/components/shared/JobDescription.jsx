import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { JOB_API_END_POINT, USER_API_END_POINT } from "@/utils/address";
import { CheckCircle, IndianRupee } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { setJobs } from "@/redux/jobSlice";

function JobSkeleton() {
  return (
    <div className="animate-pulse max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-gray-300 rounded-md" />
          <div className="space-y-3">
            <div className="h-6 w-48 bg-gray-300 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="h-12 w-32 bg-gray-300 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-6">
          <div className="h-5 w-32 bg-gray-300 rounded" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-4/6 bg-gray-200 rounded" />
          </div>
          <div className="h-5 w-32 bg-gray-300 rounded mt-6" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-16 bg-gray-200 rounded-lg" />
          <div className="h-64 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

const JobDescription = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [actionType, setActionType] = useState("");
  const [matchPercentage, setMatchPercentage] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  const getMatchLabel = (percentage) => {
    if (percentage >= 90) return "Perfect Fit";
    if (percentage >= 75) return "Great Fit";
    if (percentage >= 60) return "Good Fit";
    if (percentage >= 30) return "Average Fit";
    if (percentage > 0) return "Poor Fit";
    return "";
  };

  useEffect(() => {
    async function fetchJob() {
      try {
        setLoading(true);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setJob(res.data.job[0]);
        }
      } catch (error) {
        toast.error("Something is wrong...");
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id, refresh]);

  useEffect(() => {
    async function fetchMatch() {
      if (!job || !user) return;

      try {
        const res = await axios.post(
          `${JOB_API_END_POINT}/getMatch`,
          {
            skills: user?.profile?.skills,
            resumeLink: user?.profile?.resume,
            description: job?.description,
            requirements: job?.requirements,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        setMatchPercentage(res.data || "");
      } catch (err) {
        setMatchPercentage("50");
      }
    }
    fetchMatch();
    return () => {
      setMatchPercentage("");
    };
  }, [job, user]);

  async function applyHandler() {
    if (!user) {
      return toast.error("You must login first..", {
        duration: 2000,
        position: "top-center",
      });
    }

    if (user.role !== "student") {
      return toast.error("You must be a student to apply...", {
        duration: 2000,
        position: "top-center",
      });
    }

    const alreadyApplied = user?.appliedJobs?.some((job) => job._id === id);
    setActionType(alreadyApplied ? "removing" : "applying");
    setIsApplying(true);

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/apply`,
        { jobId: id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      dispatch(
        setUser({
          ...user,
          appliedJobs: res.data.appliedJobs,
        })
      );

      dispatch(setJobs(res.data.allJobs));
      setRefresh(!refresh);

      toast.success(res.data.message, {
        position: "top-center",
        duration: 2000,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-center",
        duration: 2000,
      });
    } finally {
      setIsApplying(false);
      setActionType("");
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col font-sans">
      <div className="flex justify-center items-center">
        <Sidebar />
        <Navbar />
      </div>

      <main className="container mx-auto px-4 py-12">
        {loading || !job ? (
          <JobSkeleton />
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link className="hover:text-purple-700" to="/jobs">
                Jobs
              </Link>
              <span className="text-gray-700 font-medium">
                / {job.title}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-start gap-4">
                {job?.logo && (
                  <img
                    src={job.logo}
                    alt="company logo"
                    onClick={() => navigate(`/companyPage/${job.company}`)}
                    className="w-16 h-16 object-contain rounded-md border shadow-sm cursor-pointer"
                  />
                )}

                <div>
                  <h2 className="mb-2 text-2xl md:text-3xl font-bold text-gray-900">
                    {job.title}
                  </h2>
                  {matchPercentage === "" ? (
                    <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse mt-1"></div>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {matchPercentage}% Skill Match - {getMatchLabel(matchPercentage)}
                    </span>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-gray-600 mt-2 text-sm">
                    <span>{job.company}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.jobType}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={applyHandler}
                className="bg-purple-700 text-white rounded-lg h-12 px-6 shadow hover:bg-purple-800 font-semibold active:scale-95 transition"
              >
                {isApplying ? (
                  actionType === "removing"
                    ? "Removing..."
                    : "Applying..."
                ) : user?.appliedJobs?.some((j) => j._id === id) ? (
                  <>
                    <CheckCircle className="inline mr-2" size={18} />
                    Applied
                  </>
                ) : (
                  "Apply Now"
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h3 className="text-lg font-semibold mb-3">
                    Description
                  </h3>
                  <p className="text-gray-700">{job.description}</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">
                    Requirements
                  </h3>
                  <p className="text-gray-700">{job.requirements}</p>
                </section>
              </div>

              <div className="space-y-6">
                <div className="bg-red-50 border rounded-lg p-5 text-center">
                  <h4 className="font-semibold text-red-800">
                    {job?.applications?.length
                      ? `${job.applications.length} Applicants`
                      : "No Applicants"}
                  </h4>
                </div>

                <div className="bg-gray-50 border rounded-lg p-5 space-y-4">
                  <h3 className="text-lg font-semibold">Job Overview</h3>

                  <div className="flex items-center gap-3">
                    <IndianRupee size={18} />
                    <span>{job.salary}</span>
                  </div>

                  <div>Location: {job.location}</div>
                  <div>Type: {job.jobType}</div>
                  <div>Experience: {job.experience} years</div>
                  <div>Vacancy: {job.vacancy}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobDescription;