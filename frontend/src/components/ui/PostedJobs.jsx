import React, { useState } from "react";
import AddJobBtn from "./AddJobBtn";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { JOB_API_END_POINT } from "@/utils/address";
import { toast } from "sonner";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";

export default function PostedJobs({ search }) {
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const user = useSelector((store) => store.auth.user);
  const loading = useSelector((store) => store.auth.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filteredPostedJobs = user?.postedJobs
    ?.slice()
    .reverse()
    .filter((job) => {
      return (
        job?.company?.toLowerCase().includes(search?.toLowerCase()) ||
        job?.title?.toLowerCase().includes(search?.toLowerCase())
      );
    });

  async function handleDelete() {
    try {
      const res = await axios.get(
        `${JOB_API_END_POINT}/delete/${deleteId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Job successfully deleted!", {
          position: "top-center",
          duration: 1000,
        });

        const updatedPostedJobs = user?.postedJobs?.filter(
          (job) => job._id !== deleteId
        );

        dispatch(
          setUser({
            ...user,
            postedJobs: updatedPostedJobs,
          })
        );
      }

      setDeleteId(null);
    } catch (err) {
      toast.error("Failed to delete!", {
        position: "top-center",
        duration: 1000,
      });
      setDeleteId(null);
    }
  }

  return (
    <div className="md:col-span-2">
      {open && (
        <div className="absolute inset-0 p-10 bg-black/50 z-50 flex items-center justify-center">
          <AddJobBtn hide={() => setOpen(false)} />
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this job?
            </h2>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="flex justify-between">
          <div className="px-6 py-2 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900"></h3>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={loading}
            className={`rounded-xl px-5 mr-6 mb-2 mt-2 
              ${
                loading
                  ? "bg-blue-300 cursor-not-allowed opacity-70"
                  : "bg-blue-400 hover:bg-blue-700 active:scale-90 cursor-pointer"
              }
              text-white font-bold transition`}
          >
            {loading ? "Posting..." : "Post a Job"}
          </button>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium uppercase text-gray-500">
                  Company Name
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase text-gray-500">
                  Job Role
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase text-gray-500 text-center">
                  Applicants
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase text-gray-500 text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredPostedJobs?.map((job) => (
                <tr key={job._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/companyPage/${job.company}`}>
                      <div className="flex items-center gap-3">
                        <img
                          src={job.logo}
                          alt="company logo"
                          className="h-10 w-10 object-contain rounded-md border"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {job.company}
                        </span>
                      </div>
                    </Link>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm text-gray-600 cursor-pointer"
                      onClick={() => navigate(`/jobs/${job._id}`)}
                    >
                      {job.title}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className="bg-blue-300 px-2 py-1 rounded-2xl hover:bg-blue-500 hover:text-white border border-black cursor-pointer">
                      <Link to={`/applications/${job._id}`}>view</Link>
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap flex justify-center items-center">
                    <Trash2
                      className="cursor-pointer text-red-500 hover:scale-110 transition"
                      onClick={() => setDeleteId(job._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}