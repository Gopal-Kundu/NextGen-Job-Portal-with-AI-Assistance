import React, { useState } from "react";
import AddJobBtn from "./AddJobBtn";
import { Link } from "react-router-dom";

export default function PostedJobs({ postedJobs }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:col-span-2">
      {/* Modal */}
      {open && (
        <div className="absolute inset-0 p-10 bg-black/50 z-50">
          <AddJobBtn hide={() => setOpen(false)} />
        </div>
      )}

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex justify-between">
          <div className="px-6 py-2 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Posted Jobs</h3>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-xl px-5 mr-6 mb-2 mt-2 bg-blue-400 active:scale-90 hover:bg-blue-700 text-white font-bold cursor-pointer"
          >
            Post a Job
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Company Name
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Job Role
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 text-center">
                  Applicants
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {postedJobs?.map((job, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{job.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-600">
                      <button className="bg-blue-300 px-2 py-1 rounded-2xl hover:bg-blue-500 hover:text-white border border-black cursor-pointer">
                        <Link to={`/applications/${job?._id}`}>view</Link>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.status === "Open" ? "bg-green-300" : "bg-gray-300"
                      }`}
                    >
                      <svg
                        className="w-2 h-2 mr-1.5"
                        fill="currentColor"
                        viewBox="0 0 8 8"
                      >
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      {job.status}
                    </span>
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
