import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import JobCard from "./Jobcard";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Jobs() {
  const jobs = useSelector((state) => state.job.jobs);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchValue.trim() !== "") {
      navigate(`/search?query=${searchValue.trim()}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <div className="h-full flex items-center">
          <Sidebar highlightIndex={2} className="bg-gray-500" />
          <Navbar />
        </div>

        {/* Search bar */}
        <div className="mt-10 ml-8 flex items-center gap-2">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search jobs..."
            className="w-2/3 h-10 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-all"
          >
            Search
          </button>
        </div>

        {/* Job listings title */}
        <div className="mt-6 ml-8">
          <h3 className="text-3xl font-bold text-gray-800">
            {jobs?.length === 0 ? (
              "No Jobs available"
            ) : (
              <>
                <span className="text-purple-700">All</span> Job Openings
              </>
            )}
          </h3>
        </div>

        {/* Job cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {jobs?.map((job, idx) => (
              <JobCard
                key={idx}
                jobType={job.jobType}
                salary={job.salary}
                vacancy={job.vacancy}
                description={job.description}
                location={job.location}
                companyName={job.company}
                role={job.title}
                datePosted={job.createdAt}
                id={job._id}
                companyLogo={job.logo}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
