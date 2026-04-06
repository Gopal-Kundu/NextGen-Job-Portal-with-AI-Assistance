import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilterApplied, setFilterSlice } from "@/redux/jobSlice";
import { toast } from "sonner";

function FilterJobs({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);
  
  const [filter, setFilter] = useState({
    salarySort: "",
    jobType: "",
    location: "",
    vacancyRange: 50,
    salaryRange: 50000,
    recomendAi: false,
  });

  useEffect(() => {
  if (user?.profile?.resume) {
    setFilter((prev) => ({
      ...prev,
      resumeLink: user.profile.resume,
    }));
  }
}, [user]);

  const handleAiToggle = () => {
    if (!user) {
      toast.error("Please Login to Get AI recommends");
      return;
    }

    if (!user?.profile?.resume) {
      toast.error("Please Upload resume to Get AI recommends");
      return;
    }

    setFilter((prev) => ({
      ...prev,
      recomendAi: !prev.recomendAi,
    }));
  };

  const applyFilter = async () => {
    setIsOpen();
    dispatch(setFilterSlice(filter));
    dispatch(setFilterApplied(true));
  };

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

              <div>
                <p className="text-sm font-medium mb-2">AI Assistance</p>
                <div
                  onClick={handleAiToggle}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-all duration-200 ${
                    filter.recomendAi
                      ? "bg-purple-100 border-purple-600 text-purple-700 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className={filter.recomendAi ? "scale-110" : ""}>✨</span>
                  Recommend AI
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">
                  Vacancy (≤ {filter.vacancyRange})
                </p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={filter.vacancyRange}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      vacancyRange: e.target.value,
                    }))
                  }
                  className="w-full accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>100+</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">
                  Salary (≤ ₹{Number(filter.salaryRange).toLocaleString()})
                </p>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={filter.salaryRange}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      salaryRange: e.target.value,
                    }))
                  }
                  className="w-full accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹0</span>
                  <span>₹2,00,000+</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Salary Sort</p>
                <div className="flex gap-3">
                  <span
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        salarySort:
                          prev.salarySort === "low-high" ? "" : "low-high",
                      }))
                    }
                    className={`px-4 py-2 rounded-full border cursor-pointer hover:bg-gray-100 ${
                      filter.salarySort === "low-high" ? "bg-gray-100" : ""
                    }`}
                  >
                    Low → High
                  </span>

                  <span
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        salarySort:
                          prev.salarySort === "high-low" ? "" : "high-low",
                      }))
                    }
                    className={`px-4 py-2 rounded-full border cursor-pointer hover:bg-gray-100 ${
                      filter.salarySort === "high-low" ? "bg-gray-100" : ""
                    }`}
                  >
                    High → Low
                  </span>
                </div>
              </div>

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

              <div>
                <p className="text-sm font-medium mb-2">Location</p>
                <input
                  type="text"
                  placeholder="Enter Location"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  value={filter.location}
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