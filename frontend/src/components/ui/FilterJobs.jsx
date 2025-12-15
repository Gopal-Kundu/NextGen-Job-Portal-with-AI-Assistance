import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "./LoadingOverlay";
import { setLoading } from "@/redux/authSlice";
import { setJobs } from "@/redux/jobSlice";
import axios from "axios";
import { toast } from "sonner";
import { JOB_API_END_POINT } from "@/utils/address";

function FilterJobs({ isOpen, setIsOpen }) {
  const loading = useSelector((store)=> store.auth.loading);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({
    vacancy: "",
    salary: "",
    jobType: "",
    location: "",
  });

  const applyFilter = async () => {
    setIsOpen();
    dispatch(setLoading(true));

    try {
      const res = await axios.post(`${JOB_API_END_POINT}/filter`, filter, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        dispatch(setJobs(res.data.jobs));
      }
    } catch (error) {
      toast.error("Server Error", {
        position: "top-center",
        message: "Something Wrong"
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  if(loading) return <LoadingOverlay message="Please Wait... Applying Filters"/>
  return (
    <>
      {isOpen ? (
        <div className="z-10000 fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-md space-y-5">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold">Filter Jobs</h2>
                <h1
                  className="text-2xl font-semibold cursor-pointer"
                  onClick={setIsOpen}
                >
                  X
                </h1>
              </div>

              {/* vacancy */}
              <div>
                <p className="text-sm font-medium mb-2">Vacancy</p>
                <div className="flex gap-3">
                  <span
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        vacancy:
                          prev.vacancy === "ascending" ? "" : "ascending",
                      }))
                    }
                    className={`px-4 py-2 rounded-full border cursor-pointer hover:bg-gray-100 ${
                      filter.vacancy === "ascending" ? "bg-gray-100" : ""
                    }`}
                  >
                    Ascending
                  </span>

                  <span
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        vacancy:
                          prev.vacancy === "descending" ? "" : "descending",
                      }))
                    }
                    className={`px-4 py-2 rounded-full border cursor-pointer hover:bg-gray-100 ${
                      filter.vacancy === "descending" ? "bg-gray-100" : ""
                    }`}
                  >
                    Descending
                  </span>
                </div>
              </div>

              {/* Salary */}
              <div>
                <p className="text-sm font-medium mb-2">Salary</p>
                <div className="flex gap-3">
                  <span
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        salary: prev.salary === "low-high" ? "" : "low-high",
                      }))
                    }
                    className={`px-4 py-2 rounded-full border cursor-pointer hover:bg-gray-100 ${
                      filter.salary === "low-high" ? "bg-gray-100" : ""
                    }`}
                  >
                    Low → High
                  </span>

                  <span
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        salary: prev.salary === "high-low" ? "" : "high-low",
                      }))
                    }
                    className={`px-4 py-2 rounded-full border cursor-pointer hover:bg-gray-100 ${
                      filter.salary === "high-low" ? "bg-gray-100" : ""
                    }`}
                  >
                    High → Low
                  </span>
                </div>
              </div>

              {/* Job Type */}
              <div>
                <p className="text-sm font-medium mb-2">Job Type</p>
                <div className="flex flex-wrap gap-3">
                  {["Internship", "Full-Time", "Part-Time", "Contract"].map(
                    (type) => (
                      <span
                        key={type}
                        onClick={() =>
                          setFilter((prev) => ({
                            ...prev,
                            jobType: prev.jobType === type ? "" : type,
                          }))
                        }
                        className={`px-4 py-2 rounded-full border cursor-pointer hover:bg-gray-100 ${
                          filter.jobType === type ? "bg-gray-100" : ""
                        }`}
                      >
                        {type}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <p className="text-sm font-medium mb-2">Location</p>
                <input
                  type="text"
                  placeholder="Enter location"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={applyFilter}
                  className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default FilterJobs;
