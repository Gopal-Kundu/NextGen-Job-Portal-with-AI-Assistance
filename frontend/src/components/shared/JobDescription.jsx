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

const JobDescription = () => {
  const [job, setJob] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [actionType, setActionType] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);
  const allJobs = useSelector((store) => store.job.Jobs);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setJob(res.data.job[0]);
        }
      } catch (error) {
        toast.error(error || "Something is wrong...");
      }
    }
    fetchJob();
  }, [refresh]);

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

      if (res.status === 201) {
        toast.success(
          res.data.message || "Your application has been removed.",
          {
            position: "top-center",
            duration: 2000,
          }
        );
      }
      if (res.status === 202) {
        toast.success(res.data.message || "Successfully applied to the job.", {
          position: "top-center",
          duration: 2000,
        });
      }

      dispatch(
        setUser({
          ...user,
          appliedJobs: res.data.appliedJobs,
        })
      );
      dispatch(setJobs(res.data.allJobs));
      setRefresh(!refresh);
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
        <Sidebar className="bg-gray-500" />
        <Navbar />
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link className="hover:text-purple-700" to="/jobs">
              Jobs
            </Link>
            <span className="material-icons text-base">chevron_right</span>
            <span className="text-gray-700 font-medium">{job.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-start gap-4">
              {job?.logo && (
                <img
                  src={job.logo}
                  alt={`${job.company} logo`}
                  onClick={() => navigate(`/companyPage/${job.company}`)}
                  className="w-16 h-16 object-contain rounded-md border border-gray-200 shadow-sm cursor-pointer"
                />
              )}

              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  {job.title}
                </h2>
                <div className="flex items-center gap-4 text-gray-600 mt-2">
                  <span>{job.company}</span>
                  <span className="text-gray-300">•</span>
                  <span>{job.location}</span>
                  <span className="text-gray-300">•</span>
                  <span>{job.jobType}</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={applyHandler}
                className="cursor-pointer active:scale-90 transform-transition duration-200 bg-purple-700 text-white rounded-lg h-12 px-6 shadow hover:bg-purple-800 font-semibold"
              >
                {isApplying ? (
                  actionType === "removing" ? (
                    "Removing..."
                  ) : (
                    "Applying..."
                  )
                ) : user?.appliedJobs.some((job) => job._id === id) ? (
                  <>
                    <CheckCircle className="inline text-white" /> Applied
                  </>
                ) : (
                  "Apply Now"
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Description
                </h3>
                {job.description}
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Requirements
                </h3>
                {job.requirements}
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-5 text-center">
                <h4 className="font-semibold text-red-800">
                  {job?.applications?.length
                    ? `${job.applications.length} Applicants`
                    : "No Applicants"}
                </h4>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Job Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="material-icons text-purple-700 mt-0.5">
                      <IndianRupee />
                    </span>
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="font-medium text-gray-800">
                        {job.salary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-icons text-purple-700 mt-0.5">
                      location_on
                    </span>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-800">
                        {job.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-icons text-purple-700 mt-0.5">
                      work
                    </span>
                    <div>
                      <p className="text-sm text-gray-500">Job Type</p>
                      <p className="font-medium text-gray-800">
                        {job.jobType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-icons text-purple-700 mt-0.5">
                      school
                    </span>
                    <div>
                      <p className="text-sm text-gray-500">
                        Experience Level
                      </p>
                      <p className="font-medium text-gray-800">
                        {job.experience} years
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-icons text-purple-700 mt-0.5">
                      badge
                    </span>
                    <div>
                      <p className="text-sm text-gray-500">Posted by</p>
                      <p className="font-medium text-gray-800">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-icons text-purple-700 mt-0.5">
                      group
                    </span>
                    <div>
                      <p className="text-sm text-gray-500">Vacancy</p>
                      <p className="font-medium text-gray-800">
                        {job.vacancy} position
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDescription;
