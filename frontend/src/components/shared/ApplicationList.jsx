import { setApplicants } from "@/redux/applicantSlice";
import { setLoading } from "@/redux/authSlice";
import { JOB_API_END_POINT } from "@/utils/address";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import LoadingOverlay from "../ui/LoadingOverlay";

export default function ApplicationsList() {
  const applications = useSelector((state) => state.applicant.applicants);
  const dispatch = useDispatch();
  const { id } = useParams(); //JobId
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  useEffect(() => {
    const fetchApplicants = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/applicant/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setApplicants(res.data.applicants));
        }
      } catch (err) {
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchApplicants();
  }, []);

  const approve = async (userId) => {
    try {
      const res = await axios.post(
        `${JOB_API_END_POINT}/approve/${id}`,
        { id: userId },
        { withCredentials: true }
      );
      if (res.data.success) {
        window.location.reload();
        toast.success(`Application approved`);
      }
    } catch {
      toast.error("Server error");
    }
  };

  const reject = async (userId) => {
    try {
      const res = await axios.post(
        `${JOB_API_END_POINT}/reject/${id}`,
        { id: userId },
        { withCredentials: true }
      );
      if (res.data.success) {
        window.location.reload();
        toast.success(`Application Rejected`);
      }
    } catch {
      toast.error("Server error");
    }
  };

  if (loading) {
    return (
      <LoadingOverlay message="Loading Applications details... wait a sec..." />
    );
  }

  if ((!applications || applications.length === 0) && loading === false) {
    return (
      <div className="p-6 text-center text-gray-500">No applications yet.</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Applications</h1>

      <div className="space-y-4">
        {applications?.map((app) => (
          <div
            key={app._id}
            className="border shadow-sm rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  app?.profile?.profilePhoto ||
                  "https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png"
                }
                alt="profile"
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold text-lg">{app?.fullname}</p>
                <p className="text-gray-600 text-sm">{app?.email}</p>
                <p className="text-sm text-gray-500 capitalize">
                  Status:
                  {app?.rejectedJobs?.includes(id)
                    ? "Rejected"
                    : app?.approvedJobs?.includes(id)
                    ? "Approved"
                    : "Pending"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button className="cursor-pointer px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm w-full sm:w-auto">
                <Link to={`/view-application/${app._id}`}>View Profile</Link>
              </button>

              <button
                onClick={() => approve(app._id)}
                className={`cursor-pointer px-3 py-1.5 text-white rounded text-sm w-full sm:w-auto ${
                  app?.approvedJobs.includes(id)
                    ? "bg-green-800 cursor-default"
                    : "bg-green-600 hover:bg-green-700 cursor-pointer"
                }`}
                disabled={app?.approvedJobs.includes(id)}
              >
                {app?.approvedJobs.includes(id) ? "Approved" : "Approve"}
              </button>

              <button
                onClick={() => reject(app._id)}
                className={`cursor-pointer px-3 py-1.5 text-white rounded text-sm w-full sm:w-auto ${
                  app?.rejectedJobs.includes(id)
                    ? "bg-red-800 cursor-default"
                    : "bg-red-500 hover:bg-red-700"
                }`}
                disabled={app?.rejectedJobs.includes(id)}
              >
                {app?.rejectedJobs.includes(id) ? "Rejected" : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
