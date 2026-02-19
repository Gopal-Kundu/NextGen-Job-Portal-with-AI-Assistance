import { setApplicants } from "@/redux/applicantSlice";
import { setLoading } from "@/redux/authSlice";
import { JOB_API_END_POINT } from "@/utils/address";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-2xl shadow-lg p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-300" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-300 rounded" />
          <div className="h-3 w-40 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-gray-300 rounded-lg" />
        <div className="h-8 w-20 bg-gray-300 rounded-lg" />
        <div className="h-8 w-20 bg-gray-300 rounded-lg" />
      </div>
    </div>
  );
}

export default function ApplicationsList() {
  const applications = useSelector((state) => state.applicant.applicants);
  const dispatch = useDispatch();
  const { id } = useParams();
  const loading = useSelector((state) => state.auth.loading);

  const [processing, setProcessing] = useState(null);

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
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchApplicants();
  }, [id, dispatch]);

  const approve = async (userId) => {
    setProcessing(`approve-${userId}`);
    try {
      const res = await axios.post(
        `${JOB_API_END_POINT}/approve/${id}`,
        { id: userId },
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedApplicants = applications.map((app) =>
          app._id === userId
            ? {
                ...app,
                approvedJobs: [...app.approvedJobs, id],
                rejectedJobs: app.rejectedJobs.filter((jobId) => jobId !== id),
              }
            : app
        );

        dispatch(setApplicants(updatedApplicants));
        toast.success("Application approved");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setProcessing(null);
    }
  };

  const reject = async (userId) => {
    setProcessing(`reject-${userId}`);
    try {
      const res = await axios.post(
        `${JOB_API_END_POINT}/reject/${id}`,
        { id: userId },
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedApplicants = applications.map((app) =>
          app._id === userId
            ? {
                ...app,
                rejectedJobs: [...app.rejectedJobs, id],
                approvedJobs: app.approvedJobs.filter((jobId) => jobId !== id),
              }
            : app
        );

        dispatch(setApplicants(updatedApplicants));
        toast.success("Application rejected");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 text-lg">
        No applications yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">
          Applications
        </h1>

        <div className="space-y-6">
          {applications.map((app) => {
            const isApproved = app?.approvedJobs?.includes(id);
            const isRejected = app?.rejectedJobs?.includes(id);
            const isApproving = processing === `approve-${app._id}`;
            const isRejecting = processing === `reject-${app._id}`;

            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-2xl transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      app?.profile?.profilePhoto ||
                      "https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png"
                    }
                    alt="profile"
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-black/5"
                  />
                  <div>
                    <p className="font-semibold text-lg text-gray-900">
                      {app?.fullname}
                    </p>
                    <p className="text-gray-600 text-sm">{app?.email}</p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium ${
                        isApproved
                          ? "bg-green-100 text-green-700"
                          : isRejected
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {isApproved
                        ? "Approved"
                        : isRejected
                        ? "Rejected"
                        : "Pending"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/view-application/${app._id}`}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm"
                  >
                    View Profile
                  </Link>

                  <button
                    onClick={() => approve(app._id)}
                    disabled={isApproved || isApproving}
                    className={`px-4 py-2 rounded-lg text-white text-sm flex items-center gap-2 transition ${
                      isApproved
                        ? "bg-green-800 cursor-default"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {isApproving ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        Approving...
                      </>
                    ) : isApproved ? (
                      "Approved"
                    ) : (
                      "Approve"
                    )}
                  </button>

                  <button
                    onClick={() => reject(app._id)}
                    disabled={isRejected || isRejecting}
                    className={`px-4 py-2 rounded-lg text-white text-sm flex items-center gap-2 transition ${
                      isRejected
                        ? "bg-red-800 cursor-default"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {isRejecting ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        Rejecting...
                      </>
                    ) : isRejected ? (
                      "Rejected"
                    ) : (
                      "Reject"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
